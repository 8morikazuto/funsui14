// utility
var fs = require("fs");

var gulp = require("gulp");
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var gulpif = require("gulp-if");
var plumber = require("gulp-plumber");

// template, preprocessor
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

// zopfli
// Tips: bin(zopflipng) in node-zopfli is too old
var zopfli = require("gulp-zopfli");

// image minify
var jpegoptim = require("imagemin-jpegoptim");
var mozjpeg = require("imagemin-mozjpeg");
var pngquant = require("imagemin-pngquant");
var zopflipng = require("imagemin-zopfli");


function releaseHTML(release) {
	var options = JSON.parse(fs.readFileSync("./develop/ejs/index.json", "utf8"));

	if(release) {
		options.style = ["style.css"];
		options.script = ["build.js"];
	}
	
	gulp.src("develop/ejs/index.ejs")
		.pipe(plumber())
		.pipe(ejs(options))
		.pipe(gulpif(release, minifyHTML(), prettify()))
		.pipe(gulp.dest("release"))
		.pipe(gulpif(release, zopfli()))
		.pipe(gulpif(release, gulp.dest("release")));
}

function releaseCSS(release) {
	var options = JSON.parse(fs.readFileSync("./develop/ejs/index.json", "utf8"));
	var src = options.style;
	var num = 0, max = 2;

	for(var i=0, l=src.length; i<l; ++i) {
		src[i] = "temp/" + src[i];
	}

	gulp.src("develop/stylus/*.styl")
		.pipe(plumber())
		.pipe(stylus())
		.pipe(prefix([
			'Android 2.3',
			'Android >= 4',
			'Chrome >= 20',
			'Firefox >= 24', // Firefox 24 is the latest ESR
			'Explorer >= 9',
			'iOS >= 6',
			'Opera >= 12',
			'Safari >= 6'
		])).pipe(csscomb())
		.pipe(base64())
		.pipe(gulp.dest("temp"))
		.on("end", onEnd);

	gulp.src(["develop/stylus/normalize.css", "develop/stylus/sweet-alert.css"])
		.pipe(gulp.dest("temp"), onEnd)
		.on("end", onEnd);


	function tempToRelease() {
		if(release) {
			gulp.src(src)
				.pipe(minifyCSS())
				.pipe(concat("style.css"))
				.pipe(gulp.dest("release/css"))
				.pipe(zopfli())
				.pipe(gulp.dest("release/css"))
				.on("end", clearTemp);
		} else {
			gulp.src("temp/**")
				.pipe(gulp.dest("release/css"))
				.on("end", clearTemp);
		}

		function clearTemp() {
			gulp.src("temp", {read: false})
				.pipe(clean());
		}

	}

	function onEnd() {
		++num;
		if(num === max) {
			tempToRelease();
		}
	}
}

function releaseJS(release) {
	var options = JSON.parse(fs.readFileSync("./develop/ejs/index.json", "utf8"));
	var src = options.script;

	for(var i=0, l=src.length; i<l; ++i) {
		src[i] = "develop/js/" + src[i];
	}

	gulp.src("develop/js/loading.js")
		.pipe(plumber())
		.pipe(gulpif(release, uglify({preserveComments:"some"})))
		.pipe(gulp.dest("release/js"))
		.pipe(gulpif(release, zopfli()))
		.pipe(gulpif(release, gulp.dest("release/js")));

	gulp.src(src)
		.pipe(plumber())
		.pipe(gulpif(release, uglify({preserveComments:"some"})))
		.pipe(gulpif(release, concat("build.js")))
		.pipe(gulp.dest("release/js"))
		.pipe(gulpif(release, zopfli()))
		.pipe(gulpif(release, gulp.dest("release/js")));
}

function releaseImage(release) {
	gulp.src("develop/img/*.png")
		.pipe(gulpif(release, pngquant({speed: 1})()))
		.pipe(gulpif(release, zopflipng({more: true})()))
		.pipe(gulp.dest("release/img"));

	gulp.src("develop/img/*.jpg")
		.pipe(gulpif(release, jpegoptim({max: 90})()))
		.pipe(gulpif(release, mozjpeg()()))
		.pipe(gulp.dest("release/img"));

	gulp.src("develop/img/thumb/*.png")
		.pipe(gulpif(release, pngquant({speed: 1})()))
		.pipe(gulpif(release, zopflipng({more: true})()))
		.pipe(gulp.dest("release/img/thumb"));

	gulp.src("develop/img/thumb/*.jpg")
		.pipe(gulpif(release, jpegoptim({max: 90})()))
		.pipe(gulpif(release, mozjpeg()()))
		.pipe(gulp.dest("release/img/thumb"));


	gulp.src("develop/favicon.ico")
		.pipe(gulp.dest("release"));

	gulp.src(["develop/webclip.png", "develop/ogp.png"])
		.pipe(gulpif(release, pngquant({speed: 1})()))
		.pipe(gulpif(release, zopflipng({more: true})()))
		.pipe(gulp.dest("release"));
}

function copyVideo() {
	gulp.src("develop/video/**")
		.pipe(gulp.dest("release/video"));
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
	releaseImage();
	copyVideo();
	copyPHP();
});

gulp.task("release", function() {
	releaseHTML(true);
	releaseCSS(true);
	releaseJS(true);
	releaseImage(true);
	copyVideo();
	copyHtaccess();
	copyPHP();
});

gulp.task("clean", function() {
	gulp.src("release", {read: false})
		.pipe(clean());
});

gulp.task("watch", function() {
	gulp.run("default");
	gulp.watch("develop/ejs/**", function() {
		releaseHTML();
	});
	gulp.watch("develop/stylus/*.styl", function() {
		releaseCSS();
	});
	gulp.watch("develop/js/*.js", function() {
		releaseJS();
	});
	gulp.watch("develop/img/**", function() {
		releaseImage();
	});
	gulp.watch("develop/video/**", function() {
		copyVideo();
	});
	gulp.watch("develop/php/*.php", function() {
		copyPHP();
	});
});

/*
gulp.task("jpeg", function() {
	gulp.src("image/jpeg/**")
		.pipe(jpegoptim({max : 70})())
		.pipe(mozjpeg()())
		.pipe(gulp.dest("image/minjpeg"));
});

gulp.task("png", function() {
	gulp.src("image/png/**")
		.pipe(pngquant({speed : 1})())
		.pipe(zopflipng({more : true})())
		.pipe(gulp.dest("image/minpng"));
});
*/
