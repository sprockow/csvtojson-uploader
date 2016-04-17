import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  classNames: 'has-advanced-upload bulk-uploader',

  ajax: Ember.inject.service(),
  attributeBindings: ['encType', 'method', 'action'],

  classNameBindings: ['isDragover'],

  //attributes
  action: '',
  method: 'POST',
  isMultipartUpload: false,

  encType: Ember.computed('isMultipartUpload', function() {
    const isMultipartUpload = this.get('isMultipartUpload');
    if (isMultipartUpload) {
      return 'multipart/form-data';
    }
  }),

  selectedFile: Ember.computed('file', 'droppedFile', function() {
    return this.get('file') || this.get('droppedFile');
  }),

  noFileSelected: Ember.computed.not('selectedFile'),

  hasFileSelected: Ember.computed('selectedFile', 'hasCompleted', 'isUploading', function() {
    const hasFile = this.get('selectedFile');
    const hasCompleted = this.get('hasCompleted');
    const isUploading = this.get('isUploading');

    return hasFile && !isUploading && !hasCompleted;
  }),

  didInsertElement() {
    this.$().on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', () => {
        this.set('isDragover', true);
      })
      .on('dragleave dragend drop', () => {
        this.set('isDragover', false);
      })
      .on('drop', (e) => {
        var file = e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0];

        if (file) {
          this.set('droppedFile', file);
        } else {
          this.set('droppedFile', null);
        }

      });

      this.$('input[type="file"]').on('change', (e) => {
        var file = e.target.files && e.target.files[0];

        if (file) {
          this.set('file', file);
        } else {
          this.set('file', null);
        }
      });
  },

  submit(e) {

    e.preventDefault();
    e.stopPropagation();

    Ember.RSVP.resolve().then(() => {
      const isUploading = this.get('isUploading');
      const ajax = this.get('ajax');

      if (isUploading) {
        return false;
      }

      this.setProperties({
        error: null,
        hasCompleted: false,
        isUploading: true
      });

      const ajaxData = new FormData(this.$().get(0));
      const droppedFile = this.get('droppedFile');

      if (droppedFile) {
        ajaxData.append( this.$('input[type="file"]').attr('name'), droppedFile);
      }

      ajax.request(this.get('action'), {
        type: this.get('method'),
        processData: false,
        contentType: false,
        data: ajaxData,
      }).then(() => {
        this.setProperties({
          isUploading: false,
          isSuccessful: true,
          hasCompleted: true
        });
      }, (err) => {
        Ember.Logger.error(err);
        this.set('error', err);
        this.setProperties({
          isUploading: false,
          isSuccessful: false,
          hasCompleted: true
        });
      });

    });

  }
});
