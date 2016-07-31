var gulp = require('gulp');
var changed = require('gulp-changed');
var design = require('./gulp-plugins/couchdb-design');
var dmc_parser = require('./gulp-plugins/dmc-parser');
var md5check = require('./gulp-plugins/csvmd5-check');
var listStudent = require('./gulp-plugins/list-student');
var request = require('request');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var postbulk = require('./gulp-plugins/post-bulk');
var updateCurrentRecord = require('./gulp-plugins/update-current-record');
var split = require('./gulp-plugins/csv-split');

var dbUrl = 'http://192.168.1.103:5984/small';
var student_cid_dir='./output/cid';
var school_dir = './csv/school';

gulp.task('split_school',function() {
  gulp.src('./csv/src/**/*.csv')
   .pipe(split({group_by:'รหัสโรงเรียน'}))
   .pipe(gulp.dest(school_dir+'/src'));
});

gulp.task('load_dmc',function() {
  gulp.src(school_dir+'/src/*.csv')
    .pipe(changed(school_dir+'/loaded'))
    .pipe(dmc_parser())
    .pipe(md5check(dbUrl))
    .pipe(postbulk(dbUrl))
    .pipe(gulp.dest(school_dir+'/loaded'));
});

gulp.task('list_student',function() {
  var design = '/_design/student/_view/by_cid?group_level=1';
  var options = {
    url:dbUrl+design
  }
  request(options)
   .pipe(source('student.json'))
   .pipe(streamify(listStudent()))
   .pipe(gulp.dest(student_cid_dir));
});

gulp.task('update_current_record',function() {
  gulp.src(student_cid_dir+'/src/*')
   .pipe(changed(student_cid_dir+'/dest'))
   .pipe(updateCurrentRecord(dbUrl))
   .pipe(postbulk(dbUrl))
   .pipe(gulp.dest(student_cid_dir+'/dest'));
});

gulp.task('default',function() {
  gulp.src(['design/**/*.js'])
    .pipe(changed('./output'))
    .pipe(design())
    .pipe(postbulk(dbUrl))
    .pipe(gulp.dest('./output'));
});

