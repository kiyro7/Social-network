const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');

// Задача для компиляции Pug в HTML
gulp.task('pug', function () {
    return gulp.src('src/views/**/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('public'));
});

// Задача для компиляции SASS в CSS
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css'));
});

// Задача для компиляции JS с Babel
gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('public/js'));
});

// Задача по умолчанию, запускает все задачи
gulp.task('default', gulp.series('pug', 'sass', 'js'));
