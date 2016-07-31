var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function(url,opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    if(file.isBuffer()) {
      var docs = JSON.parse(file.contents.toString());
      var _docs = {'docs':docs};
      gutil.log('POST '+docs.length+' '+path.basename(file.path));
      if(docs.length != 0) {
        request({
          method: 'POST',
          json: true,
          headers: {
            'content-type':'application/json'
          },
          url:url+'/_bulk_docs', 
          body:_docs
        },function(err,response,body) {
          if(err) callback(err);
          // gutil.log(body);
          callback(null,file);
          // callback(new gutil.PluginError('test', 'debug'));
        });
      } else {
        callback(null,file);
      }
    }
  });
};
