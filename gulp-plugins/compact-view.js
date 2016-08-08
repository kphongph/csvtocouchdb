var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

var compact_request = function(node,db,ts,shard,design,cb) {
  var check_url = 'http://'+node+':5986/';
  var db = encodeURIComponent('shards/'+shard+'/'+db+'.'+ts);
  var url = check_url+db;
  request.get(url+'/_design/'+design,function(err,res,body) {
    var json = JSON.parse(body);
    if(json._id) {
      request({
        method:'POST',
        url: url+'/_compact/'+design,
        json:true,
        body:{}
      },function(err,res,body) {
        gutil.log(body);
      });
    }
    
  });
  
};

module.exports = function(opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    if(file.isBuffer()) {
      var doc = JSON.parse(file.contents.toString());
      for (node in doc.by_node) {
       doc.by_node[node].forEach(function(shard) {
         var url = node.split('@');
         compact_request(url[1],doc._id,opts.ts,shard,opts.design,function() {
         });
       });
      }
    }
  });
};
