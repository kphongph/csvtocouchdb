var request = require('request');
var through = require('through2');
var gutil = require('gulp-util')

module.exports = function(url,opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    if(file.isBuffer()) {
      var cid = file.contents.toString();
      var design = '/_design/student/_view/study_records';
      design+='?startkey=["'+cid+'"]&endkey=["'+cid+'",{}]';
      var _this = this;
      request({
        method: 'GET',
        url:url+design,
        useQueryString:true
      },function(err,response,body) {
        if(err) callback(err);
        var res= JSON.parse(body);
        var max = 0;
        var current_max = [];
        var max_id = null;
        var max_obj = [0,0];
        gutil.log('check  '+cid);
        gutil.log(JSON.stringify(res,null,2));
        if(res.rows.length==0) {
          gutil.log('no record '+cid);
          callback();
        }
        res.rows.forEach(function(row) {
          var record_as = row.key[1].split('/');
          var year = parseInt(record_as[0],10);
          var time = parseInt(record_as[1],10);
          if(row.key[2]) current_max.push(row.id);
          if(max_obj[0]<year) {
            max_obj[0]=year;  
            max_obj[1]=time;
            max_id=row.id;
          } else {
            if(max_obj[0]==year) {
              if(max_obj[1]<time) {
                max_obj[1]=time;
                max_id=row.id;
              }
            }
          }
        });

        if(current_max.indexOf(max_id)!=-1) {
          if(current_max.length==1) {
            gutil.log('up-to-date '+cid);
            callback(null,file);
          }
        } else {
          // need to update
          gutil.log('need to update '+cid);
          callback();
        }
        /*
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
        */
      });
    }
  });
};
