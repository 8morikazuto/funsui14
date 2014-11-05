/*! Copyright (c) 2014 九州大学噴水企画'14 | MIT Lisence | http://git.io/JbFCbw */
(function(window, $) {
	"use strict";

	function Funsui() {

		// init
		this.$window = $(window);
		this.loaded = false;
		this.mail = {};

		this.isMobile = (/Android|iPhone|iPad|iPod|BlackBerry/i).test(window.navigator.userAgent || window.navigator.vendor || window.opera);
		this.isChrome = !!window.chrome;

		var _this = this;

		$(function() {
			// jQuery
			_this.$head = $("head");
			_this.$main = $("main");
			_this.$video = $("video");
			_this.$vcanvas = $("#vcanvas");
			_this.$top = $("#top");

			// jquery.srcset
			$("img").srcset();

			// jquery.glide
			$(".slider").glide({
				autoplay: false
			});

			// DKN
			//_this.setDKNImage();

			// mail
			_this.setMailSystem();

			// blur
			_this.setBlur();

			// mobile
			if(_this.isMobile) {
				_this.setMobile();
			}

			// fix
			_this.fixBackgroundFixed();
			_this.fixCssCalc();

			// end
			_this.loadEnd();
		});
	}

	// called from loading.js
	Funsui.prototype.openLoading = function() {
		var _this = this;
		var $load = $("#load");

		// Modernizr Transition fix
		if(Modernizr.csstransitions) {
			$load.addClass("open");
			$load.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
				$load.addClass("end");
			});
		} else {
			$load.animate({top: "-100%"}, 1000, function() {
				$load.addClass("end");
			});
		}

		
		if(this.isMobile) {

			var requestAnimationFrame = (function() {
				return  window.requestAnimationFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						function(callback){
							window.setTimeout(callback, 1000 / 60);
						};
			})();

			// Mobile
			var width = this.$window.width();
			var height = this.$main.height();
			var canvas = this.$vcanvas[0];

			var ctx = canvas.getContext("2d");
			var images = this.xjpeg.frames, i = 0, l = images.length;


			var drawVideo = function() {
				if(i < l) {
					drawImageProp(ctx, images[i].img, 0, 0, width, height, 0.5, 0.5);
					++i;
					requestAnimationFrame(drawVideo);
				} else {
					// end
					var lastImage = _this.xjpeg.frames[i-1];

					_this.$window.on("orientationchange", function() {
						drawImageProp(ctx, lastImage.img, 0, 0, width, height, 0.5, 0.5);
					});

					delete _this.xjpeg;
					_this.displayTop();
				}

			};

			this.$video.css("display", "none");

			canvas.width = width;
			canvas.height = height;

			requestAnimationFrame(drawVideo);

			// orientation
			this.$window.on("orientationchange", function() {
				width = _this.$window.width();
				height = _this.$main.height();

				canvas.width = width;
				canvas.height = height;
			});

		} else {

			// PC
			var video = this.$video[0];
			video.play();

			this.$video.on("ended", function() {
				_this.displayTop();
			});

		}

		// http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas
		function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

			/// default offset is center
			offsetX = offsetX ? offsetX : 0.5;
			offsetY = offsetY ? offsetY : 0.5;

			/// keep bounds [0.0, 1.0]
			if (offsetX < 0) offsetX = 0;
			if (offsetY < 0) offsetY = 0;
			if (offsetX > 1) offsetX = 1;
			if (offsetY > 1) offsetY = 1;

			var iw = img.width,
				ih = img.height,
				r = Math.min(w / iw, h / ih),
				nw = iw * r,   /// new prop. width
				nh = ih * r,   /// new prop. height
				cx, cy, cw, ch, ar = 1;

			/// decide which gap to fill    
			if (nw < w) ar = w / nw;
			if (nh < h) ar = h / nh;
			nw *= ar;
			nh *= ar;

			/// calc source rectangle
			cw = iw / (nw / w);
			ch = ih / (nh / h);

			cx = (iw - cw) * offsetX;
			cy = (ih - ch) * offsetY;

			/// make sure source rectangle is valid
			if (cx < 0) cx = 0;
			if (cy < 0) cy = 0;
			if (cw > iw) cw = iw;
			if (ch > ih) ch = ih;

			/// fill image in dest. rectangle
			ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
		}
	};

	Funsui.prototype.displayTop = function() {
		if(Modernizr.csstransitions) {
			this.$top.addClass("display");
		} else {
			this.$top.animate({opacity: 1}, 1000);
		}
		this.$main.addClass("open");
	};

	Funsui.prototype.setBlur = function() {
		var _this = this;

		var timer = null, time = 100;

		this.$window.on("scroll", function() {
			if(timer === null) {
				timer = setTimeout(blurFrame, time);
			}
		});

		function blurFrame() {

			var scrollTop = _this.$window.scrollTop();
			var height = _this.$window.height();
			var val = scrollTop / height * 15;
			if(scrollTop <= height) {
				if(_this.isMobile) {
					_this.$vcanvas.css("filter", "blur(" + val + "px)");
					_this.$vcanvas.css("-webkit-filter", "blur(" + val + "px)");
				} else {
					_this.$video.css("filter", "blur(" + val + "px)");
					_this.$video.css("-webkit-filter", "blur(" + val + "px)");
					_this.$video.css("-ms-filter", "progid:DXImageTransform.Microsoft.Blur(PixelRadius=" + val + ")");
				}
			}
			timer = null;
		}

	};
	
	Funsui.prototype.setDKNImage = function() {
		var uri = "https://www.googleapis.com/youtube/v3/playlistItems";
		var request = {
			part:		"snippet",
			maxResults:	1,
			playlistId:	"PL1vSSpchqjDoPpXHgCrk8E6EUTomrvB6P",
			key:		"AIzaSyBgmnnbRLGpKwqsyRy8ctjcPQWlKjYbfxI"
			//key:		"AIzaSyCy-noT8pQOp4yCaMtOkbBoqdwUZGKsS3A"
		};

		var $DKN = $("#DKNthumb");

		$.get(uri, request).done(function(val) {
			var snippet = val.items[0].snippet;
			var img = snippet.thumbnails.high;
			$DKN.attr("src", img.url);
		});

	};


	Funsui.prototype.loadEnd = function() {
		var _this = this;
		if(this.isMobile) {
			this.xjpeg.on("load", function() {
				_this.loaded = true;
			});
		} else {
			this.loaded = true;
		}
	};

	Funsui.prototype.setMobile = function() {
		var _this = this;
		setMainHeight();
		this.loadXJPEG();

		this.$window.on("orientationchange", function() {
			setMainHeight();
			_this.fixCssCalc();
		});

		function setMainHeight() {
			var height;
			if(_this.isLandscape())
				height = "availWidth" in screen ? screen.availWidth : screen.width;
			else
				height = "availHeight" in screen ? screen.availHeight : screen.height;
			_this.$main.height(height);
		}
	};

	Funsui.prototype.loadXJPEG = function() {
		var aisplitter = new AISplitter();
		this.xjpeg = aisplitter.read("video/funsui.xjpg", "XJPEG");
	};

	Funsui.prototype.isLandscape = function() {
		if(window.orientation * window.orientation === 8100)
			return true;
		else
			return false;
	};

	Funsui.prototype.fixBackgroundFixed = function() {
		var _this = this;

		if(this.isChrome || this.isMobile) {

			var $fixbf = $(".fixbf");
			$fixbf.css('background-attachment', 'scroll');

			// http://stackoverflow.com/questions/2637058/positions-fixed-doesnt-work-when-using-webkit-transform
			if(this.isChrome) {

				var $variety = $("#variety");
				$variety.css("background-size", "120%");

				this.$window.on("scroll", function(e) {

					var scrollTop = _this.$window.scrollTop();
					var height = _this.$window.height();

					$fixbf.each(function() {
						var $this = $(this);
						var photoTop = $this.offset().top;
						var photoHeight = $this.height();
						var distance = (scrollTop - photoTop);
						if(distance >= -height && distance <= photoHeight)
							$this.css('background-position', 'center ' + distance + 'px');
					});
				
				});
			}
		}
	};

	Funsui.prototype.fixCssCalc = (function() {
		var $old = null;

		return function() {
			if(!Modernizr.csscalc && this.isMobile) {
				var aboutWidth = $("#about>div").width();
				var width = aboutWidth * 0.4 - 20;
				var $head = this.$head;

				// http://stackoverflow.com/questions/10061414/changing-width-property-of-a-before-css-selector-using-jquery
				$head.append("<style>.decoration:before,.decoration:after{width:" + width + "px !important;}</style>");

				if($old !== null) $old.remove();
				$old = $head.children("style").last();
			}
		};
	})();

	Funsui.prototype.setMailSystem = function() {
		var _this = this;

		var $mail = this.mail.$form = $("#mail");
		var $label = $mail.children("label");
		var $input = this.mail.$input = $label.children("input");
		var $textarea = this.mail.$textarea = $label.children("textarea");

		var inputflag = $input.val() !== "", textareaflag = $textarea.val() !== "";
		var inputTimer = null, textareaTimer = null;
		var time = 200;

		_this.changeMailState(inputflag && textareaflag);

		$mail.on("submit", function(e) {
			e.preventDefault();
			_this.sendMail();
		});

		$input.on("input", function(e) {
			if(inputTimer === null) {
				setInputFlag(e);
				inputTimer = true;
				setTimeout(setInputTimer, time);
			} else {
				clearTimeout(inputTimer);
				inputTimer = setTimeout(setInputFlag, time, e);
			}
		});

		$textarea.on("input", function(e) {
			if(textareaTimer === null) {
				setTextareaFlag(e);
				textareaTimer = true;
				setTimeout(setTextareaTimer, time, e);
			} else {
				clearTimeout(textareaTimer);
				textareaTimer = setTimeout(setTextareaFlag, time, e);
			}
		});

		function setInputTimer() {
			inputTimer = null;
		}

		function setTextareaTimer() {
			textareaTimer = null;
		}

		function setInputFlag(e) {
			inputflag = (e.target.value !== "");
			_this.changeMailState(inputflag && textareaflag);
		}

		function setTextareaFlag(e) {
			textareaflag = (e.target.value !== "");
			_this.changeMailState(inputflag && textareaflag);
		}
	};

	Funsui.prototype.sendMail = function() {
		if(this.mail.$form.hasClass("cancel"))
			return;

		var _this = this;

		this.mail.$form.addClass("cancel");
		this.changeMailFormReadOnly(true);

		var data = this.mail.$form.serialize();

		
		$.post("sendMail", data).done(function(val) {
			if(val === "false")
				swal("Oops...", "メールの送信に失敗しました。", "error");
			else
				swal("Success!", "メールを送信しました。", "success");
		}).fail(function() {
			swal("Oops...", "メールの送信に失敗しました。", "error");
		}).always(function() {
			_this.mail.$form.removeClass("cancel");
			_this.changeMailFormReadOnly(false);
		});
		
	};

	Funsui.prototype.changeMailState = function(flag) {
		if(flag) {
			this.mail.$form.removeClass("cancel");
		} else {
			this.mail.$form.addClass("cancel");
		}
	};

	Funsui.prototype.changeMailFormReadOnly = function(flag) {
		if(flag) {
			this.mail.$input.attr("readonly", true);
			this.mail.$textarea.attr("readonly", true);
		} else {
			this.mail.$input.removeAttr("readonly");
			this.mail.$textarea.removeAttr("readonly");
		}
	};



	window.funsui = new Funsui();

})(this, jQuery);