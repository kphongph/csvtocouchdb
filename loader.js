var fs = require('fs');
var csv = require('csv');
var crypto = require('crypto');

// Read CSV content

var csv_name = process.argv[2]?'/'+process.argv[2]:"/test.csv";

var key_mapping = function(key,idx,dict,cb) {
  var name_en = null;
  for(var i=0;i<dict.length;i++) {
    if(key==dict[i].name_th) {
      name_en = dict[i].name_en;
      break;
    }
  }
  if(name_en == null) {
    cb(null,true);
  } else {
    cb(name_en,null);
  }
}

var thai_hash = function(val) {
  var md5 = crypto.createHash('md5');
  md5.update(val.replace(/\s/g,''));
  return md5.digest('base64');
};

var generate_schema = function(field_list,cb) {
  var schema = [];
  field_list.forEach(function(val,idx) {
    var digest = thai_hash(val);
    schema.push(digest);
    var obj = {'name_th':val,'name_en':digest};
    // console.log(JSON.stringify(obj),',');
  });
  cb(schema);
};

var hash_row = function(obj) {
  keys = [];
  if(obj){
    for(var key in obj){
      keys.push(key);
    }
  }
  keys.sort();
  var tObj = {};
  var key;
  var md5 = crypto.createHash('md5');
  for(var index in keys) {
    key = keys[index];
    md5.update(key);
    md5.update(obj[key]);
  }
  return md5.digest('base64');
}

var parser = csv.parse({delimiter: ','}, function(err, data) {
  generate_schema(data[0],function(schema) {
    var  documents = [];
    data.forEach(function(val,idx) {
      if(idx!=0) {
        var obj = {};
        val.forEach(function(content,idx) {
          obj[schema[idx]] = content;
        });
        obj['row_md5'] = hash_row(obj);
        documents.push(obj);
      }
    });
    var results = {'docs':documents};
    console.log(JSON.stringify(results,null,2));
  });
});

fs.createReadStream(__dirname+csv_name).pipe(parser)

// Use connect method to connect to the Server

