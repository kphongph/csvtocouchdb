var gulp = require('gulp');
var changed = require('gulp-changed');
var design = require('./gulp-plugins/couchdb-design');
var dmc_parser = require('./gulp-plugins/dmc-parser');
var md5check = require('./gulp-plugins/csvmd5-check');
var postbulk = require('./gulp-plugins/post-bulk');
var filter = require('./gulp-plugins/json-filter');
var updateCurrentRecord = require('./gulp-plugins/update-current-record');
var split = require('./gulp-plugins/csv-split');
var config = require('./config.js');
var pop_parser = require('./gulp-plugins/pop-parser');
var bstudent_parser = require('./gulp-plugins/bstu-parser');
var compact_view = require('./gulp-plugins/compact-view');

var dbUrl = config.couchdb.url+'/'+config.couchdb.db;
var dmc_csv = config.dmc_dir;
var school_dir = config.school_dir;


gulp.task('filter_pop',function() {
  gulp.src('../n_dmc_backup/dmc_1.json')
    .pipe(changed('../json/src/pop_info'))
    .pipe(filter('pop_info'))
    .pipe(gulp.dest('../json/src/pop_info'))
});

gulp.task('post_pop',function() {
  gulp.src('../json/src/pop_info/dmc_*.json')
    .pipe(changed('../json/sent/pop_info'))
    .pipe(postbulk(dbUrl))
    .pipe(gulp.dest('../json/sent/pop_info'));
});

gulp.task('parse_dmc',function() {
  gulp.src('../dmc/src/2558_03/*.csv')
    .pipe(dmc_parser({'split':10000}))
    .pipe(gulp.dest('../dmc/parsed/2558_03'));
});

gulp.task('post_dmc',function() {
  gulp.src('../dmc/parsed/2559_01/*.csv')
    .pipe(changed('../dmc/sent/2559_01'))
    .pipe(postbulk(dbUrl))
    .pipe(gulp.dest('../dmc/sent/2559_01'));
});

gulp.task('update_current_record',function() {
  gulp.src(school_dir+'/src/*.csv')
   .pipe(changed(school_dir+'/updated'))
   .pipe(updateCurrentRecord(dbUrl))
   .pipe(postbulk(dbUrl))
   .pipe(gulp.dest(school_dir+'/updated'));
});

gulp.task('default',function() {
  gulp.src(['design/dropout.js'])
    .pipe(changed('./output'))
    .pipe(design(dbUrl))
    .pipe(postbulk(dbUrl))
    .pipe(gulp.dest('./output'));
});

