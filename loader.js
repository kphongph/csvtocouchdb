var fs = require('fs');
var request = require('request');
var csv = require('csv-parser');
var crypto = require('crypto');
var config = require('./config.js');

// Read CSV content

var csv_name = process.argv[2]?'/'+process.argv[2]:"/test.csv";
var doc_type = process.argv[3]?process.argv[3]:"dmc";

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
    '/_design/csv/_view/_row_md5?key="'+md5+'"';
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
  is_exists(data['row_md5'],function(err,exists) {
    if(!err) {
      if(exists) {
        console.log(index_str+' '+'skip     '+data['row_md5']);
        sequence(list,++index);
      } else {
        save(data,function(err) {
          if(!err) {
            console.log(index_str+' '+'inserted '+data['row_md5']);
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

var count = 0;

fs.createReadStream(__dirname+csv_name).pipe(stream)
.on('headers',function(headerList) {
  headerList.forEach(function(val) {
    map_headers[val] = thai_hash(val);
  });
})
.on('data',function(data) {
   var tmp = {};
   tmp['type'] = doc_type;
   for(var key in map_headers) {
     tmp[map_headers[key]] = data[key];
   }
   tmp['row_md5'] = hash_row(tmp);
   console.log(count++,tmp['row_md5'],tmp["efPeZGe28XhJ+cIUhqLSBQ=="]);
   buffer.push(tmp);
})
.on('end',function() {
   console.log('done reading');
   // console.log(JSON.stringify(map_headers,null,2));
   sequence(buffer,0);
});

