var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function(type,opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    var self = this;
    if(file.isBuffer()) {
      gutil.log('processing ',file.path);
      var docs = JSON.parse(file.contents.toString());
      var result = [];
      docs.rows.forEach(function(doc) {
        var content = doc.doc;
        if(content.type == type) {
          delete content['_rev'];
          result.push(content);
        }
      });
      var new_doc = {'docs':result};
      file.contents = new Buffer(JSON.stringify(new_doc,null,2));
      self.push(file);
      callback(null);
    }
  });
};
