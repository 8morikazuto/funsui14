// utility
var gulp = require("gulp");
var clean = require("gulp-clean");
var gulpif = require("gulp-if");
var plumber = require("gulp-plumber");

// template
var ejs = require("gulp-ejs");
var stylus = require("gulp-stylus");

// fix
var prettify = require("gulp-prettify");
var prefix = require("gulp-autoprefixer");

// minify
var minifyHTML = require("gulp-minify-html");
var minifyCSS = require("gulp-minify-css");
var uglify = require("gulp-uglify");


function releaseHTML(minify) {
	var options = require("./develop/ejs/index.json");
	gulp.src("develop/ejs/index.ejs")
		.pipe(plumber())
		.pipe(ejs(options))
		.pipe(gulpif(minify, minifyHTML(), prettify()))
		.pipe(gulp.dest("release"));
}

function releaseCSS(minify) {
	gulp.src("develop/stylus/*.styl")
		.pipe(plumber())
		.pipe(stylus())
		.pipe(prefix())
		.pipe(gulpif(minify, minifyCSS()))
		.pipe(gulp.dest("release/css"));

	gulp.src("develop/stylus/normalize.css")
		.pipe(gulpif(minify, minifyCSS()))
		.pipe(gulp.dest("release/css"));
}

function releaseJS(minify) {
	gulp.src("develop/js/*.js")
		.pipe(plumber())
		.pipe(gulpif(minify, uglify({preserveComments:"some"})))
		.pipe(gulp.dest("release/js"));
}


// gulp setting
gulp.task("default", function() {
	releaseHTML();
	releaseCSS();
	releaseJS();
});

gulp.task("release", function() {
	releaseHTML(true);
	releaseCSS(true);
	releaseJS(true);
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
});