var fs = require('fs');
var path = require('path');
var request = require('request');
var csv = require('csv-parser');
var crypto = require('crypto');
var config = require('./config.js');
var parseArgs = require('minimist');

// var EventEmitter = require('events').EventEmitter;
// var loader_event = new EventEmitter();
// Read CSV content

var options = parseArgs(process.argv.slice(2));
var buffer = [];

var thai_hash = function(val) {
  var md5 = crypto.createHash('md5');
  md5.update(val.replace(/\s/g,''));
  return md5.digest('base64');
  //return digest;
};

var stream = csv({
  raw:false,
  separator:',',
  escape: '"',
  quote: '"'
});

var map_headers = {};
var re_map_headers = {};
var working_type = [];
var count = 0;

fs.createReadStream(path.join(__dirname,options.csv)).pipe(stream)
.on('headers',function(headerList) {
  headerList.forEach(function(val) {
    map_headers[val] = thai_hash(val);
    re_map_headers[map_headers[val]] = val;
  });
  config.schema.forEach(function(schema) {
    var missing = false;
    schema.fields.forEach(function(field) {
      if(!re_map_headers[field] && !options[field]) missing = true;
    });
    if(!missing) working_type.push(schema);
  });
})
.on('data',function() {
})
.on('end',function() {
   console.log(JSON.stringify(re_map_headers,null,2));
});


