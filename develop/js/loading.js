/*! Copyright (c) 2014 九州大学噴水企画'14 | MIT Lisence | http://git.io/JbFCbw */
(function(window) {
	"use strict";

	window.funsui = {};

	var canvas = document.getElementById("wave");
	var ctx = canvas.getContext("2d");
	var cx = canvas.width, cy = canvas.height;
	var ct = Date.now(), startFlag;

	var text = document.getElementById("percent");

	var pp = 0;
	var time33, time66;

	var requestAnimationFrame = (function() {
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function(callback){
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	ctx.fillStyle = "#45BEE6";

	requestAnimationFrame(drawWave);
	requestAnimationFrame(drawText);

	setTimeout(function(){
		startFlag = true;
	}, 500);

	window.addEventListener("DOMContentLoaded", function() {
		time33 = Date.now();
	}, false);

	window.addEventListener("load", function() {
		time66 = Date.now();
	}, false);


	function getLoadPercent() {
		var ret;
		if(!startFlag) {
			ret = 0;
		} else if(funsui.loaded) {
			ret = 100;
		} else if(time66) {
			ret = 66 + (Date.now() - time66) * 0.05;
			ret = ret < 90 ? ret : 90;
		} else if(time33) {
			ret = 33 + (Date.now() - time33) * 0.05;
			ret = ret < 66 ? ret : 66;
		} else {
			ret = (Date.now() - ct) * 0.05;
			ret = ret < 33 ? ret : 33;
		}
		return ret;
	}

	function getLoadPercentLazy() {
		var ret = pp + (getLoadPercent() - pp) * 0.05;
		pp = ret;
		return ret;
	}

	function drawWave() {
		var x = 0, y, t = Date.now();
		var percent = getLoadPercentLazy();
		var ny = (cy+25 - 250) * 0.01 * percent + 250;

		ctx.clearRect(0, 0, cx, cy);
		ctx.beginPath();

		for(var i = 0; i < cx; ++i) {
			y = ny - 18 * Math.sin(i * 0.020 + (t - ct) * 0.005) | 0;
			if(i === 0)
				ctx.moveTo(i, y);
			else
				ctx.lineTo(i, y);
		}

		ctx.lineTo(cx, cy);
		ctx.lineTo( 0, cy);

		ctx.closePath();
		ctx.fill();

		if(ny > cy+23) {
			// load end
			pp = 100;
			setTimeout(function() {
				funsui.openLoading();
			}, 1000);
		} else {
			requestAnimationFrame(drawWave);
		}
		
	}

	function drawText() {
		text.textContent = ~~pp +"%";
		if(pp === 100) {
			setTimeout(function() {
				text.textContent = "Enter!!";
			}, 400);
		} else {
			requestAnimationFrame(drawText);
		}
	}

})(this);