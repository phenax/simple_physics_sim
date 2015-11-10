/*
PhysicsOnCanvas

## Really buggy ##
Please view in full screen mode.
Click anywhere to shoot a ball.
The speed of the ball depends on how far away from the bottom-left corner you click.

*/

(function() {
	var timer;
	var canvas= document.getElementById("canv");
	var width= canvas.width= window.innerWidth;
	var height= canvas.height= window.innerHeight;
	var ctx= canvas.getContext("2d");

	var el = {
		_gravity:document.querySelector(".gravity"),
		_framerate:document.querySelector(".framerate"),
		_position:document.querySelectorAll("input.pos"),
		_goofy:document.querySelector("input.goofy"),
		_co: {
			x:document.getElementById("x"),
			y:document.getElementById("y"),
			x_vel:document.getElementById("x_vel"),
			speed:document.getElementById("speed"),
			y_vel:document.getElementById("y_vel")
		}
	};

	var ball= {
		radius: 20, // Size of ball
		color: "#D32F2F" // Color of ball
	};

	var global= {
		g: 0.002, // Acceleration due to gravity
		from_loc: [50,height-50], // Initial position
		coef_of_restitution: 0.85, // Coefficient of restitution
		frame_rate:15, // Higher value to go slow-mo
		time_incr:2, // Increment in time(0 if u dont want gravity)
		limits: {
			vert: [ball.radius,height-(ball.radius)], // Vertical boundaries [lower,upper]
			hort: [ball.radius,width-(ball.radius)] // Horizontal boundaries [lower,upper]
		},
		goofyPhysics:false
	};

	var draw = function(x,y) { // The part where I draw circle
		ctx.clearRect(0,0,width,height);
		ctx.beginPath();
		ctx.fillStyle= ball.color;
		ctx.arc(x,y,ball.radius,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	};

	var components_of_vel = function(to_loc) {
		var diff= [
			global.from_loc[1] - to_loc[1],
			to_loc[0] - global.from_loc[0]
		];

		var dist = Math.sqrt(Math.pow(diff[0],2) + Math.pow(diff[1],2));
		ball.vel = dist*50/width; // Setting the velocity of the ball according to the distance of click to its initial position

		var m= (diff[0])/(diff[1]); // m = (y2 - y1)/(x2 - x1)
		var ang= Math.atan(m);
		var x_vel= ball.vel*Math.cos(ang);
		var y_vel= (-1)*ball.vel*Math.sin(ang); // Negative because this is a canvas and not 2d cartesian space.

		return [x_vel,y_vel];
	};

	var displayData = function(x,y,x_vel,y_vel) {
		x = Math.round(x*10)/10;
		y = Math.round(y*10)/10;
		x_vel = Math.round(x_vel*10)/10;
		y_vel = Math.round(y_vel*10)/10;
		speed = Math.round(Math.sqrt((x_vel*x_vel) + (y_vel*y_vel))*10)/10;
		(el._co.x).innerHTML = x;
		(el._co.y).innerHTML = y;
		(el._co.x_vel).innerHTML = x_vel;
		(el._co.y_vel).innerHTML = y_vel;
		(el._co.speed).innerHTML = speed;
	};

	var shooter= function(e) {
		if(timer) { clearInterval(timer); } // Removing the old ball

		var comp= components_of_vel([e.pageX,e.pageY]);	
		var x_vel= comp[0];
		var y_vel= comp[1];
		var x= global.from_loc[0];
		var y= global.from_loc[1];

		var t= 0;
		var z= 0;

		timer= setInterval(function() {

			// Drawing on canvas
			draw(x,y);

			// Checking if the ball is inside the boundaries

			if(x>global.limits.hort[1] || x<global.limits.hort[0]) {
				x_vel= -x_vel*global.coef_of_restitution;
				if(z === 1) {
					z= 0;
				} else {
					z= 1;
				}
			}

			if(y>global.limits.vert[1] || y<global.limits.vert[0]) {
				y_vel= -y_vel*global.coef_of_restitution;
				if(z === 1) {
					z= 0;
				} else {
					z= 1;
				}
			}

			x+= x_vel;
			y+= y_vel;

			if(z===1 && global.goofyPhysics) {
				y_vel+= global.g/t;
			} else {
				y_vel+= global.g*t;
			} // Gravity

			displayData(x,y,x_vel,y_vel);

			t+=global.time_incr;
		},global.frame_rate);
	};

	var gravity_tog= function() { // Toggle Gravity
		global.g = (this.checked)? 0 : 0.002;
	};

	var set_framerate= function() { // Change FrameRate
		global.frame_rate = this.value;
	};

	var change_init_pos = function() { // Change Initial Position
		var pos = this.value;
		var go;

		switch(pos) {
			case "tr":
				go = [width-50,50];
				break;
			case "tl":
				go = [50,50];
				break;
			case "br":
				go = [width-50,height-50];
				break;
			case "bl":
				go = [50,height-50];
				break;
		}

		global.from_loc = go;
	};

	var goofy_phy = function() { /// Goofy Physics
		alert("Goofy Physics may get weird! Viewer dicretion is adviced.");
		global.goofyPhysics = !global.goofyPhysics;
	};

	document.addEventListener('DOMContentLoaded', function () {

		// You do stuff, and it does some other stuff and then stuff happens

		canvas.addEventListener('click',shooter);
		el._gravity.addEventListener('change',gravity_tog);
		el._framerate.addEventListener('change',set_framerate);
		el._goofy.addEventListener('change',goofy_phy);
		for(var i= 0; i< (el._position).length; i++) {
			el._position[i].addEventListener('change',change_init_pos);
		}
	});
})();