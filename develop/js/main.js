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
			_this.$top = $("#top");

			// jquery.srcset
			$("img").srcset();

			// mail
			_this.setMailSystem();

			// chrome
			if(_this.isChrome)
				_this.fixBackgroundFixed();

			_this.setBlur();

			// debug
			_this.loaded = true;
		});
	}

	Funsui.prototype.openLoading = function() {
		var _this = this;
		var $load = $("#load");

		$load.addClass("open");
		$load.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
			$load.addClass("end");
		});

		var video = this.$video[0];
		video.play();

		this.$video.on("ended", function() {
			_this.displayTop();
		});
	};

	Funsui.prototype.displayTop = function() {
		this.$top.addClass("display");
		this.$main.addClass("open");
	};

	Funsui.prototype.setBlur = function() {
		var _this = this;

		this.$window.on("scroll", function() {
			var scrollTop = _this.$window.scrollTop();
			var height = _this.$window.height();
			var val = scrollTop / 150;
			if(scrollTop <= height) {
				_this.$video.css("-webkit-filter", "blur(" + val + "px)");
				_this.$video.css("-ms-filter", "progid:DXImageTransform.Microsoft.Blur(PixelRadius=" + val + ")");
			}
		});

	};

	Funsui.prototype.fixBackgroundFixed = function() {
		var _this = this;

		// http://stackoverflow.com/questions/2637058/positions-fixed-doesnt-work-when-using-webkit-transform
		var $fixbf = $(".fixbf");
		$fixbf.css('background-attachment', 'scroll');

		this.$window.on("scroll", function(e) {

			var scrollTop = _this.$window.scrollTop();

			$fixbf.each(function() {
				var $this = $(this);
				var photoTop = $this.offset().top;
				var distance = (photoTop - scrollTop);
				$this.css('background-position', 'center ' + (distance*-1) + 'px');
			});
		
		});
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
			
		}).success(function() {
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