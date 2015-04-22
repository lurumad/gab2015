var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    less    = require('gulp-less'),
    jshint  = require('gulp-jshint'),
    inject  = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    templateCache = require('gulp-angular-templatecache');

gulp.task('server', function() {
    connect.server({
        root: './public/views',
        port: 8080,
        livereload: true
    });
});

gulp.task('server-pro', function () {
    connect.server({
        root: './dist',
        port: 8080,
        livereload: true
    });
});

gulp.task('templates', function () {
    gulp.src('./public/views/partials/*.html')
    .pipe(templateCache({
            root: '/views/partials',
            module: 'app.templates',
            standalone: true
        }))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('compress', function () {
    gulp.src('./public/views/index.html')
    .pipe(useref.assets())
    .pipe(gulpif('*.js', uglify({ mangle: false })))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy', function () {
    gulp.src('./public/views/index.html')
    .pipe(useref())
    .pipe(gulp.dest('./dist'));
});

gulp.task('inject', function() {
    var sources = gulp.src(['./public/js/**/*.js', './public/stylesheets/**/*.css'], {
        read: false,
        ignorePath: './public/views'
    });

    return gulp.src('index.html', { cwd: './public/views' })
        .pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('./public/views'));
});

gulp.task('wiredep', function () {
    gulp.src('./public/views/index.html')
        .pipe(wiredep({
            directory: './public/lib'
        }))
        .pipe(gulp.dest('./public/views'));
});

gulp.task('css', function () {
    gulp.src('./public/stylesheets/main.less')
        .pipe(less())
        .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('html', function()
{
    gulp.src('./public/views/**/*.html')
        .pipe(connect.reload());
});

gulp.task('jshint', function () {
    return gulp.src('./public/js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function() {
    gulp.watch(['./public/views/**/*.html'], ['html']);
    gulp.watch(['./public/stylesheets/**/*.less'], ['css','inject']);
    gulp.watch(['./public/js/**/*.js','./Gulpfile.js'], ['jshint','inject']);
    gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['server','inject','wiredep','watch']);
gulp.task('build', ['compress','copy']);