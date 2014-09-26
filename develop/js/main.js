function Funsui() {
	"use strict";

	// init
	this.init();
}

Funsui.prototype = {

	init: function() {
		this.$window = $(window);

		$(function() {

		});
	}

};

window.funsui = new Funsui();