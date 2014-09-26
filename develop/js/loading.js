(function() {
	"use strict";
	var canvas = document.getElementById("wave");
	var ctx = canvas.getContext("2d");
	var cx = canvas.width, cy = canvas.height;
	var ct = null;
	ctx.fillStyle = "#45BEE6";

	var text = document.getElementById("percent");

	var pp = 0, waveTimer, textTimer;
	var time50 = null;
	var flag100 = null;

	function getLoadPercent() {
		var ret;
		if(ct === null) {
			ret = 0;
		}else if(flag100) {
			ret = 100;
		} else if(time50 !== null) {
			ret = 50 + (Date.now() - time50) * 0.05;
			ret = ret < 90 ? ret : 90;
		} else {
			ret = (Date.now() - ct) * 0.05;
			ret = ret < 50 ? ret : 50;
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
		var dx = 0.1, ny = (cy+15 - 125) * 0.01 * percent + 125;
		if(ny > cy+14) {
			clearInterval(waveTimer);
			pp = 100;
		}

		ctx.clearRect(0, 0, cx, cy);
		ctx.beginPath();

		for(var i = 0; x < cx; ++i) {
			x += dx;
			y = ny - 12.0 * Math.sin(dx * i * 0.040 + (t - ct) * 0.004);
			if(i === 0)
				ctx.moveTo(x, y);
			else
				ctx.lineTo(x, y);
		}

		ctx.lineTo(cx, cy);
		ctx.lineTo( 0, cy);

		ctx.closePath();
		ctx.fill();
	}

	function drawText() {
		text.innerText = ~~pp +"%";
		if(pp === 100) {
			clearInterval(textTimer);
			setTimeout(function() {
				text.innerText = "Enter!!";
			}, 800);
		}
	}

	waveTimer = setInterval(drawWave, 10);
	textTimer = setInterval(drawText, 10);
	
	setTimeout(function(){
		ct = Date.now();
	}, 500);

	window.addEventListener("DOMContentLoaded", function() {
		time50 = Date.now();
	}, false);

	window.addEventListener("load", function() {
		flag100 = true;
	}, false);

})();