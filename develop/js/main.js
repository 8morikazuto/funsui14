function Funsui() {
	"use strict";

	// init
	this.init();
}

Funsui.prototype = {

	init: function() {
		"use strict";
		this.$window = $(window);

		$(function() {
			// jquery.srcset
			$("img").srcset();
		});
	}

};

window.funsui = new Funsui();