/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: deployTarget
    }
  };

  var TWO_YEAR_CACHE_PERIOD_IN_SEC = 60 * 60 * 24 * 365 * 2;

  ENV.s3 = {
    bucket: 'csv-to-api-assets',
    region: 'us-west-2',
    cacheControl: {
      'assets/anon.js': 'max-age=10',
      'assets/anon.css': 'max-age=10',
      'assets/*.js': 'max-age='+TWO_YEAR_CACHE_PERIOD_IN_SEC,
      'assets/*.css': 'max-age='+TWO_YEAR_CACHE_PERIOD_IN_SEC,
      '**': 'max-age=10'
    },
    expires: false
  };

  ENV['s3-index'] = {
    bucket: 'csv-to-api-assets',
    region: 'us-west-2',
    allowOverwrite: true
  };

  ENV['revision-data'] = {
    type: 'git-commit'
  };

  ENV['cloudfront'] = {
    distribution: 'E2XQ6MOZB76LYD'
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
