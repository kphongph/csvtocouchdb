var request = require('request');
var fs = require('fs');

var file_name = process.argv[2];

console.log(file_name);

fs.readFile(file_name,function(err,contents) {
  var json = JSON.parse(contents.toString());
  var formatted = JSON.stringify(json,null,2);
  console.log(formatted);
  fs.writeFile(file_name,formatted,function(err) {
    var opts = {
      url:'http://192.168.1.101:5986/_dbs',
      method:'POST',
      json:true,
      body:json
    };
    request(opts,function(err,res,body) {
      console.log(body);
    });
  });
});
