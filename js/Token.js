'use strict';

var canvas = document.getElementById('canvas2');
var context = canvas.getContext('2d');
canvas.width = 150;
canvas.height = 600;
var myCircle = {
      x: canvas.width /2,
      y: 0,
      radius: canvas.width /2,
};
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

	
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.clip();
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

	context.fillStyle = color;

	context.fill();
	context.lineWidth = 4;
	context.strokeStyle = "#000000";
	context.stroke();

	context.closePath();
}

function resetCanvas() {
	context.beginPath();
	context.rect(0, 0, 150, 600);
	context.fillStyle = 'orange';
	context.fill();
	context.lineWidth = 7;
	context.strokeStyle = 'black';
	context.stroke();
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
/*    var values = this.$$('input').map(function () {
      return this.value;
    });
    var playerName = values[0];
    var color = values[1];
    for(var i = players.length - 1; i >= 0; i--) {
      if(players[i][1] === color) {
        alert('Color already token.');
        return e.cancel();
      }
    }
    //logToHistory(playerName + ' enter the game.');
    players.push([playerName, color]);*/
    var player = '<div class="player"><input type="button" class="delete" value="Delete"><span class="token" style="background: ' + values[1] + '"></span>' + values[0].replace(/</g, '&lt;') + '</div>';
    $('#players').html($('#players').html() + player);
    /*var col = '';
    for(var i = 0; i < 6; i++) {
      col += Math.floor(Math.random() * 16).toString(16);
    }
    this.$('input[type="color"]').value = '#' + col;
    var playerNameInput = this.$('input[type="text"]');
    playerNameInput.value = '';
    playerNameInput.focus();*/
    return e.cancel();
  });

function animate(myCircle, canvas, context, startTime) {
	// update

		var time = (new Date()).getTime() - startTime;

		var linearSpeed = 500;
		// pixels / second
		var newY = linearSpeed * time / 1000;
		
		if(newY < canvas.height - myCircle.radius) {
			isAnimated = true;

			myCircle.y = newY;


			// clear
			// context.clearRect(0, 0, canvas.width, canvas.height);
			drawToken(myCircle);

			console.log("toto");
			// request new frame
			requestAnimFrame(function() {
				animate(myCircle, canvas, context, startTime);
			});

		} else {
			// Fin de l'animation. Rajout de la position de l'objet dans la case associée.
			console.log("here");
			isAnimated = false;
		}

	
}

function drawTokenForCanvas(id) {
	if (!isAnimated) {
		var myCanvas = 'canvas' + id;
		console.log(myCanvas);
		canvas = document.getElementById(myCanvas);
		context = canvas.getContext('2d');
		canvas.width = 150;
		canvas.height = 600;

		var startTime = (new Date()).getTime();

		animate(myCircle, canvas, context, startTime);
	}
}