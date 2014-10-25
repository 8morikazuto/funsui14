(function(window, $) {

	function Funsui() {
		"use strict";

		// init
		this.$window = $(window);
		this.loaded = false;
		this.mail = {};
		this.mobile = (/Android|iPhone|iPad|iPod|BlackBerry/i).test(window.navigator.userAgent || window.navigator.vendor || window.opera);

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

			// debug
			_this.loaded = true;
		});
	}

	Funsui.prototype.openLoading = function() {
		var _this = this;
		$("#load").addClass("open");
		this.$main.css("display", "block");

		var video = this.$video[0];
		video.play();

		this.$video.on("ended", function() {
			_this.displayTop();
		});
	};

	Funsui.prototype.displayTop = function() {
		this.$top.addClass("display");
		this.$main.css("overflow", "visible");
	};

	Funsui.prototype.setMailSystem = function() {
		var _this = this;

		var mail = $("#mail");
		var label = mail.children("label");
		var input = label.children("input");
		var textarea = label.children("textarea");

		var inputflag = false, textareaflag = false;


		mail.on("submit", function(e) {
			e.preventDefault();
			_this.sendMail();
		});

		input.on("input", function(e) {
			inputflag = (e.target.value !== "");
			_this.changeMailState(inputflag && textareaflag);
		});

		textarea.on("input", function(e) {
			textareaflag = (e.target.value !== "");
			_this.changeMailState(inputflag && textareaflag);
		});

		this.mail.form = mail;
		this.mail.input = input;
		this.mail.textarea = textarea;
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