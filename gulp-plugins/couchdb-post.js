var request = require('request');
var through = require('through2');

module.exports = function(url,opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    if(file.isBuffer()) {
      var json = JSON.parse(file.contents.toString());
      request({
        method: 'GET',
        url:url+'/'+json._id 
      },function(err,response,body) {
        var current = JSON.parse(body);
        json['_rev'] = current._rev;
        request({
          method: 'PUT',
          url:url+'/'+json._id,
          json: true,
          headers: {
            'content-type':'application/json'
          },
          body: json
        },function(err,response,body) {
          if(err) {
            console.log(err);
          } else {
            console.log(JSON.stringify(body));
          }
        });
      });
    }
    this.push(file);
    callback();
  });
};
