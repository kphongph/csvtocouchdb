var through = require('through2');

module.exports = function(opts) {
  return through.obj(function(file,enc,callback) {
    var doc = {};
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
    // console.log(JSON.stringify(doc,null,2));
    file.contents = new Buffer(JSON.stringify([doc]));
    this.push(file);
    return callback();
  });
}

