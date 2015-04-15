// Token model
function Token(y, color) {
	this.x = 75;
	this.y = y;
	if (color) {
		this.color = color;		
	} else {
		this.color = "#fbdd12";
	}
	this.column = 0;
	this.radius = 73;

	this.draw = function() {
		var canvas = document.getElementById("canvas" + this.column);
		var context = canvas.getContext("2d");
        
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);

		context.fillStyle = this.color;

		context.fill();
		context.lineWidth = 4;
		context.strokeStyle = "#000000";
		context.stroke();

		//context.closePath();
	}
};