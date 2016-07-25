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
  //return digest;
};

var save = function(data,cb) {
  // console.log('saving '+data.row_md5);
  var options = {
    uri:config.couchdb.url+'/'+config.couchdb.db,
    method:'POST',
    json:data
  };
  request(options,function(err,response,body) {
    if(!err && response.statusCode == 200) {
      var json_obj = JSON.parse(body);
      if(json_obj.ok) {
        cb(null,true);
      } else {
        cb(json_obj,null);
      }
    } else {
      cb(err,null);
    }
  });
};

var is_exists = function(md5,cb) {
  var db_url = config.couchdb.url+'/'+ config.couchdb.db;
  var request_url = db_url +
    '/_design/csv/_view/_csv_md5?key="'+md5+'"';
  // console.log(request_url);
  request(request_url, function(err,response,body) {
    if(!err) {
      var json_obj = JSON.parse(body);
      if(json_obj.rows) {
        if(json_obj.rows.length == 0)  {
          cb(null,false);
        } else {
          cb(null,true);
        }
      } else {
        cb(json_obj,null);
      }
    } else {
      cb(err,null);
    }
  });
};

var hash_row = function(obj) {
  keys = [];
  if(obj){
    for(var key in obj){
      keys.push(key);
    }
  }
  keys.sort();
  var key;
  var md5 = crypto.createHash('md5');
  for(var index in keys) {
    key = keys[index];
    md5.update(key);
    if(obj[key]) {
      md5.update(obj[key]);
    }
  }
  return md5.digest('hex');
}

var stream = csv({
  raw:false,
  separator:',',
  escape: '"',
  quote: '"'
});


var sequence = function(list,index) {
  var index_str = ''+(index+1)+':'+list.length;
  if(index > list.length-1) return;
  var data = list[index];   
  is_exists(data['csv_md5'],function(err,exists) {
    if(!err) {
      if(exists) {
        console.log(index_str+' '+'skip     '+data['csv_md5']);
        sequence(list,++index);
      } else {
        save(data,function(err) {
          if(!err) {
            console.log(index_str+' '+'inserted '+data['csv_md5']);
            sequence(list,++index);
          } else {
            console.log(index_str+' '+'error   '+JSON.stringify(err));
            return;
          }
        });
      }
    } else {
      console.log(err);
      return;
    }
  });
};

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
.on('data',function(data) {
   // console.log(working_type[0]);
   working_type.forEach(function(schema) {
     var tmp = {'type':schema.type};
     schema.fields.forEach(function(field) {
       tmp[field] = data[re_map_headers[field]]?
         data[re_map_headers[field]]:options[field];
     });
     tmp['csv_md5'] = hash_row(tmp);
     buffer.push(tmp);
   });
})
.on('end',function() {
   console.log('done reading');
   // console.log(JSON.stringify(map_headers,null,2));
   // console.log(JSON.stringify(buffer,null,2));
   sequence(buffer,0);
});
