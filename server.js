var express = require('express');
var path = require('path');
var gulp = require('gulp');
var respond = require('gulp-respond');
var through2 = require('through2');
var fs = require('fs');
var config = require('./config.js');
var dmc_parser = require('./gulp-plugins/dmc-parser');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var waiting_file = null;

var list_waiting = function(cb) {
  fs.readdir(path.join(config.school_dir,'src'),function(err,files) {
    if(err) { 
      throw err;
    } else {
      var waiting = [];
      fs.readdir(path.join(config.school_dir,'loaded'),function(err,loaded) {
        files.forEach(function(file) {
          if(loaded.indexOf(file)==-1) {
            waiting.push(file);
          }
        });
        cb(waiting);
      });
    }
  });
}

var file_info = function(file_name) {
  return through2.obj(function(data,encoding,callback) {
    var json = JSON.parse(data.contents);   
    var obj = {'file':file_name,'rows':json};
    data.contents = new Buffer(JSON.stringify(obj));
    this.push(data);
    callback();
  });
}
  

var get_file = function(list,res) {
  var file = list.pop();
  var src_file = path.join('src',file);
  gulp.src(path.join(config.school_dir,src_file))
   .pipe(dmc_parser())
   .pipe(file_info(file))
   .pipe(respond(res));
  // res.json({'file':file});
}

app.get('/dmc/save_file',function(req,res) {
  console.log(req.query.file);
  if(req.query.file) {
    var filepath = path.join(config.school_dir,'loaded');
    filepath = path.join(filepath,req.query.file);
    fs.open(filepath, "wx", function (err, fd) {
      fs.close(fd, function (err) {
        if(err) {
          res.json({'ok':false});
        } else {
          res.json({'ok':true});
        }
      });
    });
  }
});

app.get('/dmc/update_file',function(req,res) {
  list_waiting(function(waiting) {
    waiting_file = waiting;
    res.json(waiting_file);
  });
});

app.get('/dmc/get_file',function(req,res) {
  if(waiting_file) {
    get_file(waiting_file,res);
  } else {
    list_waiting(function(waiting) {
      waiting_file = waiting;
      get_file(waiting,res);
    });
  }
});


var server = app.listen(3000,function() {
  console.log("Example app listening at port 3000");
});

