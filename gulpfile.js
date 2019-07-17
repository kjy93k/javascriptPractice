const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const replace = require('gulp-replace')
const rename = require('gulp-rename');
const tap = require('gulp-tap');
const minify = require('gulp-minify');

const path = require('path');

// PostCSS
const postcss = require('gulp-postcss')
const pxtorem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')
const oldie = require('oldie')

const watch = require('gulp-watch')

const initStyleFile = ['./work/**/scss/*.scss'];
const initJsFile = ['./work/**/devjs/*.js'];

gulp.task('sass', () => {
    return gulp.src('./work/**/scss/*.scss', { base: './' })
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' })).on('error', sass.logError)
        // .pipe(replace('url(../../img', 'url(../img'))
        .pipe(postcss([
            autoprefixer()
        ]))
        // .pipe(sourcemaps.write())
        .pipe(rename(path => {
            path.dirname += '/../css';
            path.basename = 'main';
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('js', () => {
    const jsSrc = './work/**/devjs/*.js';
    return gulp.src(jsSrc, { base: './' })
        .pipe(minify())
        .pipe(rename(path => {
            let basename = path.basename;
            path.dirname += '/../js';
            path.basename = 'main';

            // if ('-min' === basename.substr(basename.length - 4)) {
            //     path.dirname += '/../js';
            //     path.basename = 'main';
            // }
            // else {
            //     return null;
            // }
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('watch', () => {
    //gulp.watch(initStyleFile, ['sass'])
    console.log(initStyleFile);
    console.log(initJsFile);
    watch(['./work/**/scss/*.scss', ...initStyleFile], function () {
        gulp.start('sass');
    });
    watch(initJsFile, function () {
        gulp.start('js');
    });
});

gulp.task('default', ['sass', 'watch', 'js']);
