var gulp = require('gulp');
var changed = require('gulp-changed');
var design = require('./gulp-plugins/couchdb-design');
var dmc_parser = require('./gulp-plugins/dmc-parser');
var md5check = require('./gulp-plugins/csvmd5-check');
var postbulk = require('./gulp-plugins/post-bulk');
var updateCurrentRecord = require('./gulp-plugins/update-current-record');
var split = require('./gulp-plugins/csv-split');
var config = require('./config.js');
var pop_parser = require('./gulp-plugins/pop-parser');
var bstudent_parser = require('./gulp-plugins/bstu-parser');
var compact_view = require('./gulp-plugins/compact-view');

var dbUrl = config.couchdb.url+'/'+config.couchdb.db;
var dmc_csv = config.dmc_dir;
var school_dir = config.school_dir;

gulp.task('pop',function() {
  gulp.src('./population/a-pop-t2/src/file_*.csv')
   .pipe(changed('./population/a-pop-t2/json'))
   .pipe(pop_parser())
  // .pipe(md5check(dbUrl))
   .pipe(postbulk(dbUrl))
   .pipe(gulp.dest('./population/a-pop-t2/json'));
});

gulp.task('pop1',function() {
  gulp.src('./population/a-pop-t1/src/file_1.csv')
   .pipe(changed('./population/a-pop-t1/json'))
   .pipe(bstudent_parser())
  // .pipe(md5check(dbUrl))
  // .pipe(postbulk(dbUrl))
   .pipe(gulp.dest('./population/a-pop-t1/json'));
});

gulp.task('bstu1',function() {
  gulp.src('./population/b-stu1/src/file_*.csv')
   .pipe(changed('./population/b-stu1/json'))
   .pipe(_parser())
  // .pipe(md5check(dbUrl))
   .pipe(postbulk(dbUrl))
   .pipe(gulp.dest('./population/b-stu1/json'));
});


gulp.task('compact_view',function() {
  gulp.src('dmc_backup.db')
   .pipe(compact_view({ts:'1470399454',design:'csv'}));
});


// gulp.task('split_school',function() {
//  gulp.src(dmc_csv+'/**/*.csv')
//   .pipe(split({group_by:'รหัสโรงเรียน'}))
//   .pipe(gulp.dest(school_dir+'/src'));
// });


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

