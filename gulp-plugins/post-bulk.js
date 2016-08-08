var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function(url,opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    var self = this;
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
          var new_doc = 0;
          body.forEach(function(doc) {
            if(doc.ok) new_doc++;
          });
          file.contents = new Buffer(''+new_doc);
          self.push(file);
          callback(null);
          // callback(new gutil.PluginError('test', 'debug'));
        });
      } else {
        callback(null,file);
      }
    }
  });
};
