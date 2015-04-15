'use strict';


var rows = 4;
var columns = 7;
var tokens = {};

var isAnimated = false;

function drawAllToken(column) {
	var canvas = document.getElementById("canvas" + column);
	var context = canvas.getContext("2d");
	
	for (var row = rows; row >= 0; row--)
	{
		var item = tokens[column+','+row];
		if (typeof(item) != 'undefined') {
			context.beginPath();

			context.arc(item.x, item.y, item.radius, 0, 2 * Math.PI, false);

			context.fillStyle = item.color;

			context.fill();
			context.lineWidth = 4;
			context.strokeStyle = "#000000";
			context.stroke();
			context.closePath();

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
    var player = new Player($('input[type="color"]').val());
    players.push(player);

    $('input[type="text"]').val("");
    // Changement de la couleur pour éviter les doublons
    var newColor = '';
    for(var i = 0; i < 6; i++) {
      newColor += Math.floor(Math.random() * 16).toString(16);
    }
    console.log("avant");
    $('input[type="color"]').val('#' + newColor);
    console.log("après");
    $('input[type="text"]').focus();
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

function animate(myCircle, canvas, context, startTime, nbTokens) {
	// update
	var time = (new Date()).getTime() - startTime;
	var index = myCircle.y%canvas.height;
	var linearSpeed = 500;
	// pixels / second
	var newY = linearSpeed * time / 1000;
	var limitY = canvas.height - (nbTokens * 2 * myCircle.radius) - myCircle.radius;
	if(newY < limitY) {
		isAnimated = true;

		myCircle.y = newY;

		myCircle.draw();
		drawAllToken(myCircle.column);
		// request new frame
		requestAnimFrame(function() {
			animate(myCircle, canvas, context, startTime, nbTokens);
		});

	} else {
		// Fin de l'animation. Rajout de la position de l'objet dans la case associée.
		var y = Math.ceil(myCircle.y /(2*myCircle.radius));
		if (typeof(tokens[myCircle.column + ',' + y]) == 'undefined')
			tokens[myCircle.column + ',' + y] = myCircle;
		isAnimated = false;
		myCircle.y = limitY;
		myCircle.draw();
		drawAllToken(myCircle.column);
	}
}

$('#startGame').on('submit', function (e) {
	// body...
	var values = [];
	$('input[type="number"]').each(function () {
		values.push($(this).val());
    });
    rows = values[0];
    columns = values[1];
    $('#dropzone').html('');
    for (var column = 0; column < columns; column++) {
    	//console.log(column);
    	var canvas = '<canvas id="canvas' + column + '" width="100" height="400" onclick="drawTokenForCanvas(' + column + ')"></canvas>';
    	console.log(canvas);
    	$('#dropzone').append(canvas);
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
});

var currentPlayer = 0;
function drawTokenForCanvas(x) {
	if (!isAnimated) {

		// Définition du canvas et de ses propriétés pour le dessin.
		var myCanvasId = 'canvas' + x;

		var canvas = document.getElementById(myCanvasId);
		var context = canvas.getContext('2d');
		canvas.width = 150;
		canvas.height = 600;

		// Création du jeton à déssiner avec gestion de la couleur.
		var color;
		if (currentPlayer >= 0 && currentPlayer<players.length) {
			color = players[currentPlayer].color;
		}
		else {
			currentPlayer = 0; 
			color = players[currentPlayer].color;
		}
		currentPlayer++;

		var myToken = new Token(- canvas.width/2, color);
		myToken.column = x;

		var startTime = (new Date()).getTime();
		var nbTokens;

		// On anime que jusqu'au dernier jeton.
		for (nbTokens = 0; tokens[x + ',' + (rows - nbTokens)]; nbTokens++);
			if(nbTokens < rows) {
				animate(myToken, canvas, context, startTime, nbTokens);
			} else {
				drawAllToken(x);
			}
	} 
}