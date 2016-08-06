var request = require('request');

var json = {
  source:'small',
  target:'http://10.27.65.55:5984/dmc_backup'
};

var options = {
  url:'http://192.168.1.103:5984/_replicate',
  method:'POST',
  json:true,
  body:json
};

request(options,function(err,response,body) {
  if(err) {
    console.log('Error');
    console.log(err);
  }
  if(body) {
    console.log(body);
  }
});
