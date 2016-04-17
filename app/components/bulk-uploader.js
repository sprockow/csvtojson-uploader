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
        this.set('files', e.originalEvent.dataTransfer.files);
      });
  },

  submit(e) {

    e.preventDefault();
    e.stopPropagation();

    return Ember.RSVP.resolve().then(() => {
      const isUploading = this.get('isUploading');
      const ajax = this.get('ajax');

      if (isUploading) {
        return false;
      }

      this.setProperties({
        isError: false,
        isSuccess: false
      });

      const ajaxData = new FormData(this.$().get(0));
      const droppedFiles = this.get('files');

      if (droppedFiles) {
        $.each( droppedFiles, (i, file) => {
          ajaxData.append( this.$('input[type="file"]').attr('name'), file );
        });
      }

      //TODO call s3 token service

      $.ajax(this.get('action'), {
        type: this.get('method'),
        processData: false,
        contentType: false,
        data: ajaxData,
        success: (data) => {
          this.set('isSuccess', true);
        },
        error: (err) => {
          Ember.Logger.error(err);
          this.set('isError', true);
        }
      });

    });

    return false;

  }
});
