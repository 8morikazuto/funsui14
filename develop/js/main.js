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
			_this.$main = $("main");
			_this.$video = $("video");
			_this.$vcanvas = $("#vcanvas");
			_this.$top = $("#top");

			// jquery.srcset
			$("img").srcset();

			// mail
			_this.setMailSystem();

			// mobile
			if(_this.isMobile) {
				_this.$main.height("availHeight" in screen ? screen.availHeight : screen.height);
				_this.loadXJPEG();
			}

			// fix
			_this.fixBackgroundFixed();

			// blur
			_this.setBlur();

			// debug
			_this.loadEnd();
		});
	}

	// called from loading.js
	Funsui.prototype.openLoading = function() {
		var _this = this;
		var $load = $("#load");

		$load.addClass("open");
		$load.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
			$load.addClass("end");
		});

		
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
					delete _this.xjpeg;

					_this.displayTop();
				}

			};

			this.$video.css("display", "none");

			canvas.width = width;
			canvas.height = height;

			requestAnimationFrame(drawVideo);

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

			if (arguments.length === 2) {
				x = y = 0;
				w = ctx.canvas.width;
				h = ctx.canvas.height;
			}

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
		this.$top.addClass("display");
		this.$main.addClass("open");
	};

	Funsui.prototype.setBlur = function() {
		var _this = this;

		var timer = null;
		this.$window.on("scroll", function() {
			if(timer === null) {
				timer = setTimeout(function() {
					var scrollTop = _this.$window.scrollTop();
					var height = _this.$window.height();
					var val = scrollTop / 120;
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
				}, 100);
			}
		});

	};
	
	Funsui.prototype.loadXJPEG = function() {
		var aisplitter = new AISplitter();
		this.xjpeg = aisplitter.read("video/funsui.xjpg", "XJPEG");
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

	Funsui.prototype.fixBackgroundFixed = function() {
		var _this = this;

		if(this.isChrome || this.isMobile) {

			var $fixbf = $(".fixbf");
			$fixbf.css('background-attachment', 'scroll');

			// http://stackoverflow.com/questions/2637058/positions-fixed-doesnt-work-when-using-webkit-transform
			if(this.isChrome) {
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

	Funsui.prototype.setMailSystem = function() {
		var _this = this;

		var $mail = $("#mail");
		var $label = $mail.children("label");
		var $input = $label.children("input");
		var $textarea = $label.children("textarea");

		var inputflag = $input.val() !== "", textareaflag = $textarea.val() !== "";

		$mail.on("submit", function(e) {
			e.preventDefault();
			_this.sendMail();
		});

		$input.on("input", function(e) {
			inputflag = (e.target.value !== "");
			_this.changeMailState(inputflag && textareaflag);
		});

		$textarea.on("input", function(e) {
			textareaflag = (e.target.value !== "");
			_this.changeMailState(inputflag && textareaflag);
		});

		this.mail.form = $mail;
		this.mail.input = $input;
		this.mail.textarea = $textarea;
	};

	Funsui.prototype.sendMail = function() {
		if(this.mail.form.hasClass("cancel"))
			return;

		var _this = this;

		this.mail.form.addClass("cancel");
		this.changeMailFormReadOnly(true);

		var data = this.mail.form.serialize();

		
		$.post("sendMail", data).done(function() {
			
		}).success(function(val) {
			console.log(val);
			swal("Success!", "メールを送信しました。", "success");
		}).error(function() {
			swal("Oops...", "メールの送信に失敗しました。", "error");
		}).complete(function() {
			_this.mail.form.removeClass("cancel");
			_this.changeMailFormReadOnly(false);
		});
		
	};

	Funsui.prototype.changeMailState = function(flag) {
		var state = this.mail.form.hasClass("cancel");

		if(flag && state) {
			this.mail.form.removeClass("cancel");
		} else if(!flag && !state) {
			this.mail.form.addClass("cancel");
		}
	};

	Funsui.prototype.changeMailFormReadOnly = function(flag) {
		if(flag) {
			this.mail.input.attr("readonly", true);
			this.mail.textarea.attr("readonly", true);
		} else {
			this.mail.input.removeAttr("readonly");
			this.mail.textarea.removeAttr("readonly");
		}
	};



	window.funsui = new Funsui();

})(this, jQuery);