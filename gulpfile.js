"use_strict";

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rewriteCSS = require('gulp-rewrite-css');
var gcmq = require('gulp-group-css-media-queries');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var Twig    = require('twig');
var twig = require('gulp-twig');

var paths = {
    sass: './scss',
    css: './css',
    fontIcons: './font/icons',
    js: './js',
    templates: './templates',
    img: './img',
    build: './build'
};


/*
* SASS Compile
*/

gulp.task('sass', function () {
    return gulp.src(paths.sass + '/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded', sourceMap: true, cache_path: paths.sass}).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions', 'ie 8', 'ie 9', 'ie 10', 'ie 11'],
        }))
        .pipe(sourcemaps.write('./'))
        //.pipe(gcmq())
        .pipe(gulp.dest(paths.css));
});

/*
* CSS Minify
*/

gulp.task('cssmin', function(){
    var pipe = gulp.src([
        paths.css + '/reset.css',
        paths.js + '/vendor/swiper/swiper.min.css',
        //paths.js + '/vendor/tooltipster/tooltipster.bundle.min.css',
        paths.js + '/vendor/fancybox/jquery.fancybox.css',
        paths.js + '/vendor/ionrange/ion.rangeSlider.min.css',
        //paths.js + '/vendor/jscrollpane/jquery.jscrollpane.css',
        //paths.js + '/vendor/jqueryui/jquery-ui.min.css',
        //paths.js + '/vendor/jqueryui/jquery-ui.structure.min.css',
        //paths.js + '/vendor/jqueryui/jquery-ui.theme.min.css',
        paths.css + '/animate.css',
        paths.css + '/style.css'
    ])
        .pipe(plumber())
        .pipe(rewriteCSS({destination: paths.build}))
        .pipe(sourcemaps.init())
        .pipe(concat('build.css'));
    /*var taskname = this.seq.slice(-1)[0];
    if (taskname == "production") {
        pipe = pipe.pipe(cssnano());
    }*/

    pipe = pipe.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.build));
    return pipe;
});


/*
* JS Minify
*/

gulp.task('jsmin', function(){
    var pipe = gulp.src([
        paths.js + '/vendor/jquery-3.2.1.min.js',
        //paths.js + '/vendor/imagesloaded.pkgd.min.js',
        //paths.js + '/vendor/jquery.mousewheel.min.js',
        //paths.js + '/vendor/jquery.touchSwipe.min.js',
        //paths.js + '/vendor/jquery.placeholder.min.js',
        paths.js + '/vendor/jquery.inputmask.bundle.min.js',
        //paths.js + '/vendor/autosize.min.js',
        //paths.js + '/vendor/jquery.spinner.min.js',
        //paths.js + '/vendor/tooltipster/tooltipster.bundle.min.js',
        paths.js + '/vendor/validate/jquery.validate.min.js',
        paths.js + '/vendor/validate/additional-methods.min.js',
        paths.js + '/vendor/swiper/swiper.jquery.min.js',
        paths.js + '/vendor/fancybox/jquery.fancybox.min.js',
        paths.js + '/vendor/ionrange/ion.rangeSlider.min.js',
        //paths.js + '/vendor/jscrollpane/jquery.jscrollpane.min.js',
        //paths.js + '/vendor/jscrollpane/jquery.mousewheel.js',
        //paths.js + '/vendor/jscrollpane/mwheelIntent.js',
        //paths.js + '/vendor/jqueryui/jquery-ui.min.js',
        //paths.js + '/vendor/jqueryui/jquery.ui.touch-punch.min.js',
        //paths.js + '/vendor/appear.js',
        //paths.js + '/vendor/jquery.cookie.js',
        //paths.js + '/utils.js',
        paths.js + '/ajax-handlers.js',
        paths.js + '/widgets.js',
        paths.js + '/script.js'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('build.js'));

    /*var taskname = this.seq.slice(-1)[0];
    if (taskname == "production") {
        pipe = pipe.pipe(uglify({
            ie8: true
        }));
    }*/

    pipe = pipe.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.build));
    return pipe;
});

gulp.task('jsminhead', function(){
    var pipe = gulp.src([
        //paths.js + '/vendor/es5-shim.min.js',
        paths.js + '/vendor/modernizr/modernizr.js'
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('build-head.js'));

    /*var taskname = this.seq.slice(-1)[0];
    if (taskname == "production") {
        pipe = pipe.pipe(uglify({
            ie8: true
        }));
    }*/
    pipe = pipe.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.build));
    return pipe;
});

/*
* Twig process
*/


gulp.task('twig', function(){
    return gulp.src(paths.templates + '/*.twig') // **/
        .pipe(twig())
        .pipe(gulp.dest('./'));
});

/*
* Server Init
*/

gulp.task('server', function() {

    var express = require('express');
    var app     = express();

    Twig.cache(false);
    app.set('view engine', 'twig');
    app.set('twig options', {
        base: './',
        strict_variables: false
    });
    app.set('views', './');
    var statics = ['css', 'js', 'font', 'img', 'pic', 'ajax', 'build', 'files', 'works'];
    for (i in statics) {
        app.use('/' + statics[i], express.static('./' + statics[i]));
    }
    app.get('/*.html', function (req, res) {
        var fileName = req.url.replace(/\..*$/g, '') || 'index';
        res.render('templates/' + fileName + '.twig');
    });
    app.get('/', function (req, res) {
        res.redirect('/index.html');
    });
    var listener = app.listen();
    var port = listener.address().port;
    var browserSync = require('browser-sync').create();
    browserSync.init({
        proxy: 'http://localhost:' + port,
        startPath: '/',
        notify: false,
        tunnel: false,
        host: 'localhost',
        port: port,
        logPrefix: 'Proxy to localhost:' + port,
    });
    browserSync.watch(['./build/*', './templates/**/*']).on('change', browserSync.reload);
});


/*
* Watch
*/

gulp.task('watch', function(){
    gulp.watch([paths.sass + '/**/*.scss'], gulp.series('sass','cssmin'));
    gulp.watch([paths.css + '/*.css', paths.font + '/*.css'],gulp.series('cssmin'));
    gulp.watch([paths.js + '/*.js'], gulp.series('jsmin'));
    gulp.watch([paths.templates + '/*.twig'],gulp.series('twig'));
});


/*
* Main Tasks
*/

gulp.task('default', gulp.series('twig', 'sass', 'cssmin', 'jsmin', 'jsminhead',gulp.parallel('watch','server')));

gulp.task('production', gulp.series('twig', 'sass', 'cssmin', 'jsmin','jsminhead'));