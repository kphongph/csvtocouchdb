var through = require('through2');
var request = require('request');

module.exports = function(url) {
  return through.obj(function(file,enc,callback) {
    var doc = {};
    var self = this;
    if(file.isBuffer()) {
      var design = require(file.path);
      doc['_id'] = '_design/'+design.name;
      doc['views'] = {};
      for(var view in design.views) {
        doc['views'][view] = {};
        for(var fn in design.views[view]) {
          if(design.views[view][fn]) {
            doc['views'][view][fn] = design.views[view][fn].toString();
          }
        }
      }
    }
    
    request.get(url+'/'+doc['_id'],function(err,response,body) {
      var _rdoc = JSON.parse(body);
      doc['_rev'] = _rdoc['_rev']; 
      file.contents = new Buffer(JSON.stringify([doc]));
      self.push(file);
      callback(null);
    });
  });
}

