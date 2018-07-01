'use strict'
const gulp = require('gulp'),
    watch = require('gulp-watch'),
    //styles
    sourcemaps = require('gulp-sourcemaps'),
    prefixer = require('gulp-autoprefixer'),
    // html
    rigger = require('gulp-rigger'),
    // clear
    del = require('del'),
    // loggers and notifiers
    notify = require('gulp-notify'),
    gulplog = require('gulplog'),
    //accessory
    combine = require('stream-combiner2').obj,
    gulpIf = require('gulp-if');
    newer = require('gulp-newer');

const config = {
    html: {
        src: "",
        dest: "",
        watch: "",
    },
    styles: {
        src: "",
        dest: "",
        watch: "",
    },
    scripts: {
        src: "",
        dest: "",
        watch: "",
    },
    assets: {
        src: "",
        dest: "",
        watch: "",
    }
};


//for production use NODE_ENV=production gulp <task>
var isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

/* clean dist folder */
gulp.task('clear', function(callback) {
    return del(path.clean);
});

/* compile html from partial */
gulp.task('html', function(callback) {
    return combine( // make container
        gulp.src(config.html.src), // find html
        rigger(), // apply includes !!! add file before included !!!, it may crush task
        gulp.dest(config.html.dest)) // put to build folder
    .on('error', notify.onError(function(error) {
            return {
                title: 'HTML Error',
                message: error.message
            };
        }))); // show message if error
});

gulp.task('styles', function(callback) {
    return combine(
        gulp.src(config.styles.src),
        gulpIf(isDev, sourcemaps.init()), // start sourcemap if development
        rigger(), // or any CSS preprocessors
        prefixer(), // add browser prefixes
        gulpIf(isDev, sourcemaps.write()), // write sourcemap if development
        gulp.dest(confin.styles.dest))
        .on('error', notify.onError(function(error) {
            return {
                title: 'Styles Error',
                message: error.message
            };
        }));
    );
});

gulp.task('scripts', function(callback) {
    return gulp.src(config.scripts.src, {since: gulp.lastRun('assets')})
        .pipe(gulp.dest(confin.styles.dest))   
    );
});

gulp.task('assets', function(callback) {
    return gulp.src(config.assets.src, {since: gulp.lastRun('assets')})
			.pipe(newer(config.asssets.dest))
			.pipe(gulp.dest(config.assets.dest));
});

gulp.task('watch', function() {
    gulp.watch(config.html.watch, gulp.series('html'));
    gulp.watch(config.styles.watch, gulp.series('styles'));
    gulp.watch(config.scripts.watch, gulp.series('scripts'));
  //  gulp.watch(config.assets.watch, gulp.series('assets'));
});


gulp.task('build', gulp.series('clear', gulp.parallel('html', 'styles', 'scripts')));

gulp.task('default', gulp.series('build'));