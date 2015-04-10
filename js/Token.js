'use strict';


var rows = 4;
var columns = 7;

var canvas = document.getElementById('canvas2');
var context = canvas.getContext('2d');
canvas.width = 150;
canvas.height = 600;

// Token model
function Token(x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.radius = canvas.width/2;
}

var myCircle = new Token(canvas.width /2, 0, '#fbdd12');

var isAnimated = false;
function drawToken (token, color) {
	if (!color) {
		color = "#fbdd12";
	}
	// Don't forget those dimension to avoid circle to be messed up
	canvas.width = 150;
	canvas.height = 600;

	var radius = canvas.width / 2;
	var centerX = token.x;
	var centerY = token.y;
	console.log(centerY);

	
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	//context.clip();
	//context.beginPath();
	//context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

	context.fillStyle = color;

	context.fill();
	context.lineWidth = 4;
	context.strokeStyle = "#000000";
	context.stroke();

	context.closePath();
}

function drawAllToken(tokens) {
	for (var row = 0; row <= rows; row++)  {
		for (var column = 0; column <= columns; column++) {
			var token = tokens[row + ',' + column] || 0;
			if (token) {
				drawToken(tokens[row + ',' + column], tokens[row + ',' + column].color);
			}
		}
	}
}

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame 
	|| window.webkitRequestAnimationFrame 
	|| window.mozRequestAnimationFrame 
	|| window.oRequestAnimationFrame 
	|| window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var players = [];

$('#add-player').on('submit', function (e) {
	var values = [];
	$('input').each(function () {
      values.push($(this).val());
    });
    var player = '<div class="player"><input type="button" class="delete" value="Delete"><span class="token" style="background:' + values[1] + '"></span>' + values[0].replace(/</g, '&lt;') + '</div>';
    $('#players').html($('#players').html() + player);
    console.log("work");
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

function animate(myCircle, canvas, context, startTime, nbTokens) {
	// update
	drawAllToken(tokens);
	var time = (new Date()).getTime() - startTime;
	var index = myCircle.y%canvas.height;
	var linearSpeed = 500;
	// pixels / second
	var newY = linearSpeed * time / 1000;
	var limitY = canvas.height - (nbTokens * 2 * myCircle.radius) - myCircle.radius;
	if(newY < limitY) {
		isAnimated = true;

		myCircle.y = newY;

		drawToken(myCircle);

		// request new frame
		requestAnimFrame(function() {
			animate(myCircle, canvas, context, startTime, nbTokens);
		});

	} else {
		// Fin de l'animation. Rajout de la position de l'objet dans la case associée.
		var y = Math.ceil(myCircle.y /(2*myCircle.radius));
		console.log(y);
		tokens[myCircle.column + ',' + y] = myCircle;
		isAnimated = false;
		myCircle.y = limitY;
		drawToken(myCircle);
	}
}

var tokens = {};
function drawTokenForCanvas(x) {
	if (!isAnimated) {
		var myCanvasId = 'canvas' + x;
		myCircle.column = x;
		canvas = document.getElementById(myCanvasId);
		context = canvas.getContext('2d');
		canvas.width = 150;
		canvas.height = 600;

		var canvasCopie = document.getElementById(myCanvasId);
		var contextCopie = canvas.getContext('2d');


		var startTime = (new Date()).getTime();
		var nbTokens;
		for (nbTokens = 0; tokens[x + ',' + (rows - nbTokens)]; nbTokens++);

		if(nbTokens < rows) {
			animate(myCircle, canvasCopie, contextCopie, startTime, nbTokens);
		}
	}
}