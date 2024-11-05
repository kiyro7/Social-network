const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

// Путь к файлам
const paths = {
    sass: {
        src: 'src/sass/**/*.scss',
        dest: 'public/css'
    },
    pug: {
        src: 'src/views/**/*.pug',
        dest: 'public/views'
    },
    js: {
        src: 'src/js/**/*.js',
        dest: 'public/js'
    },
    webpack: {
        entry: './src/js/index.js',
        output: {
            filename: 'bundle.js',
            path: __dirname + '/public/js'
        }
    }
};

// Задача для преобразования SASS в CSS
gulp.task('sass', function () {
    return gulp.src(paths.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.sass.dest))
        .pipe(browserSync.stream());
});

// Задача для компиляции Pug в HTML
gulp.task('pug', function () {
    return gulp.src(paths.pug.src)
        .pipe(pug())
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(browserSync.stream());
});

// Задача для обработки JS с использованием Webpack и Babel
gulp.task('webpack', function () {
    return gulp.src(paths.js.src)
        .pipe(webpack({
            mode: 'development',
            entry: paths.webpack.entry,
            output: paths.webpack.output,
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(paths.js.dest));
});

// Наблюдение за изменениями в файлах
gulp.task('watch', function () {
    gulp.watch(paths.sass.src, gulp.series('sass'));
    gulp.watch(paths.pug.src, gulp.series('pug'));
    gulp.watch(paths.js.src, gulp.series('webpack'));
});

// Задача по умолчанию для разработки
gulp.task('default', gulp.series('sass', 'pug', 'webpack', 'watch'));
