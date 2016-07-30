var request = require('request');
var crypto = require('crypto');
var csv = require('csv-parser');

module.exports.thai_hash = function(val) {
  var md5 = crypto.createHash('md5');
  md5.update(val.replace(/\s/g,''));
  return md5.digest('base64');
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

module.exports.check_exists = function(dbUrl,md5,cb) {
  var request_url = dbUrl + '/_design/csv/_view/_csv_md5?key="'+md5+'"';
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

module.exports.hash_row = function(obj) {
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
