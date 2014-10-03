// utility
var fs = require("fs");

var gulp = require("gulp");
var clean = require("gulp-clean");
var gulpif = require("gulp-if");
var plumber = require("gulp-plumber");

// template
var ejs = require("gulp-ejs");
var stylus = require("gulp-stylus");

// fix html
var prettify = require("gulp-prettify");

// fix css
var prefix = require("gulp-autoprefixer");
var csscomb = require("gulp-csscomb");
var base64 = require("gulp-css-base64");

// minify
var minifyHTML = require("gulp-minify-html");
var minifyCSS = require("gulp-minify-css");
var uglify = require("gulp-uglify");

// gzip
var gzip = require("gulp-gzip");


function releaseHTML(minify) {
	var options = JSON.parse(fs.readFileSync("./develop/ejs/index.json", "utf8"));
	gulp.src("develop/ejs/index.ejs")
		.pipe(plumber())
		.pipe(ejs(options))
		.pipe(gulpif(minify, minifyHTML(), prettify()))
		.pipe(gulp.dest("release"))
		.pipe(gulpif(minify, gzip({ gzipOptions: { level: 9 } })))
		.pipe(gulpif(minify, gulp.dest("release")));
}

function releaseCSS(minify) {
	gulp.src("develop/stylus/*.styl")
		.pipe(plumber())
		.pipe(stylus())
		.pipe(prefix())
		.pipe(csscomb())
		.pipe(base64())
		.pipe(gulpif(minify, minifyCSS()))
		.pipe(gulp.dest("release/css"))
		.pipe(gulpif(minify, gzip({ gzipOptions: { level: 9 } })))
		.pipe(gulpif(minify, gulp.dest("release/css")));

	gulp.src("develop/stylus/normalize.css")
		.pipe(gulpif(minify, minifyCSS()))
		.pipe(gulp.dest("release/css"))
		.pipe(gulpif(minify, gzip({ gzipOptions: { level: 9 } })))
		.pipe(gulpif(minify, gulp.dest("release/css")));
}

function releaseJS(minify) {
	gulp.src("develop/js/*.js")
		.pipe(plumber())
		.pipe(gulpif(minify, uglify({preserveComments:"some"})))
		.pipe(gulp.dest("release/js"))
		.pipe(gulpif(minify, gzip({ gzipOptions: { level: 9 } })))
		.pipe(gulpif(minify, gulp.dest("release/js")));
}

function copyImage() {
	gulp.src("develop/img/**")
		.pipe(gulp.dest("release/img"));
}

function copyHtaccess() {
	gulp.src("develop/.htaccess")
		.pipe(gulp.dest("release"));
}

function copyPHP() {
	gulp.src("develop/php/*.php")
		.pipe(gulp.dest("release"));
}


// gulp setting
gulp.task("default", function() {
	releaseHTML();
	releaseCSS();
	releaseJS();
	copyImage();
	copyPHP();
});

gulp.task("release", function() {
	releaseHTML(true);
	releaseCSS(true);
	releaseJS(true);
	copyImage();
	copyHtaccess();
	copyPHP();
});

gulp.task("clean", function() {
	gulp.src("release", {read: false})
		.pipe(clean());
});

gulp.task("watch", function() {
	gulp.watch(["develop/ejs/index.ejs", "develop/ejs/index.json"], function() {
		releaseHTML();
	});
	gulp.watch("develop/stylus/*.styl", function() {
		releaseCSS();
	});
	gulp.watch("develop/js/*.js", function() {
		releaseJS();
	});
	gulp.watch("develop/img/**", function() {
		copyImage();
	});
	gulp.watch("develop/php/*.php", function() {
		copyPHP();
	});
});