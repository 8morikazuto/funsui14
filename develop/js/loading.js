window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function() {
	"use strict";
	var canvas = document.getElementById("wave");
	var ctx = canvas.getContext("2d");
	var cx = canvas.width, cy = canvas.height;
	var ct = Date.now(), startFlag;

	var text = document.getElementById("percent");

	var pp = 0;
	var time50, flag100;

	ctx.fillStyle = "#45BEE6";

	requestAnimationFrame(drawWave);
	requestAnimationFrame(drawText);


	function getLoadPercent() {
		var ret;
		if(!startFlag) {
			ret = 0;
		}else if(flag100) {
			ret = 100;
		} else if(time50) {
			ret = 50 + (Date.now() - time50) * 0.05;
			ret = ret < 90 ? ret : 90;
		} else {
			ret = (Date.now() - ct) * 0.05;
			ret = ret < 50 ? ret : 50;
		}
		return ret;
	}

	function getLoadPercentLazy() {
		var ret = pp + (getLoadPercent() - pp) * 0.1;
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
			pp = 100;
		} else {
			requestAnimationFrame(drawWave);
		}
		
	}

	function drawText() {
		text.textContent = ~~pp +"%";
		if(pp === 100) {
			setTimeout(function() {
				text.textContent = "Enter!!";
			}, 800);
		} else {
			requestAnimationFrame(drawText);
		}
	}

	
	setTimeout(function(){
		startFlag = true;
	}, 500);

	window.addEventListener("DOMContentLoaded", function() {
		time50 = Date.now();
	}, false);

	window.addEventListener("load", function() {
		flag100 = true;
	}, false);

})();