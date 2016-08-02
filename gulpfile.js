var gulp = require('gulp');
var changed = require('gulp-changed');
var design = require('./gulp-plugins/couchdb-design');
var dmc_parser = require('./gulp-plugins/dmc-parser');
var md5check = require('./gulp-plugins/csvmd5-check');
var postbulk = require('./gulp-plugins/post-bulk');
var updateCurrentRecord = require('./gulp-plugins/update-current-record');
var split = require('./gulp-plugins/csv-split');
var config = require('./config.js');

var deletefile = require('gulp-delete-file');
var dbUrl = config.couchdb.url+'/'+config.couchdb.db;
var dmc_csv = config.dmc_dir;
var school_dir = config.school_dir;

gulp.task('split',function() {
  gulp.src(dmc_csv+'/**/*.csv')
   .pipe(split({group_by:'รหัสโรงเรียน'}))
   .pipe(gulp.dest(school_dir+'/src'));
});


gulp.task('delete_src',['split'],function() {
  var regexp =/\w*\.csv$/;
  gulp.src(dmc_csv+'/**/*.csv')
   .pipe(deletefile({reg: regexp,deleteMatch:true}));
});

gulp.task('split_school',['split','delete_src']);

gulp.task('load_dmc',function() {
  gulp.src(school_dir+'/src/*.csv')
    .pipe(changed(school_dir+'/loaded'))
    .pipe(dmc_parser())
    .pipe(md5check(dbUrl))
    .pipe(postbulk(dbUrl))
    .pipe(gulp.dest(school_dir+'/loaded'));
});

gulp.task('update_current_record',function() {
  gulp.src(school_dir+'/src/*.csv')
   .pipe(changed(school_dir+'/updated'))
   .pipe(updateCurrentRecord(dbUrl))
   .pipe(postbulk(dbUrl))
   .pipe(gulp.dest(school_dir+'/updated'));
});

gulp.task('default',function() {
  gulp.src(['design/**/*.js'])
    .pipe(changed('./output'))
    .pipe(design(dbUrl))
    .pipe(postbulk(dbUrl))
    .pipe(gulp.dest('./output'));
});

