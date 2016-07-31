var crypto = require('crypto');

module.exports.thai_hash = function(val) {
  var md5 = crypto.createHash('md5');
  md5.update(val.replace(/\s/g,''));
  return md5.digest('base64');
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
