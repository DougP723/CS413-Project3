var game_scale = 0.6
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(1000, 600, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = game_scale;
stage.scale.y = game_scale;

var player;
var world;
var text;
var speedometer;
var gasP_texture = PIXI.Texture.fromImage("gaspedal.png");
var gaspedal;

//The following variables are used to dictate the race car's direction. Since I like using degrees
// but PIXI wants to do radians, I scienced up a formula so that I can still do degrees.
var radiansToDegrees = 180/Math.PI; 
var playerAngle = 70; //The starting angle of the car
var playerRotation = playerAngle/radiansToDegrees;

// Character movement constants:
var playerAcceleration = 0;

// The move function starts or continues movement
function move() {
	console.log("move");
  	
  	var split_amount_x;
  	var split_amount_y;
  	if ((player.rotation*radiansToDegrees) <= 90){
  		//The player is facing quadrant 1
  		if (player.vx <= 10 && player.vy >= -10 ){
  			split_amount_x = (player.rotation*radiansToDegrees)/90;
  			split_amount_y = 1 - split_amount_x;
  			player.vx += split_amount_x;
  			player.vy -= split_amount_y;

  		}
  	}
  	if ((player.rotation*radiansToDegrees) > 90 && (player.rotation*radiansToDegrees) <= 180){
  		//The player is facing quadrant 2
  		if (player.vx <= 3 && player.vy <= 3 ){	
  			split_amount_y = ((player.rotation*radiansToDegrees)-90)/90;
  			split_amount_x = 1 - split_amount_y;
  			player.vx += split_amount_x;
  			player.vy += split_amount_y;
  		}
  	}
  	else if ((player.rotation*radiansToDegrees) > 180 && (player.rotation*radiansToDegrees) <= 270){
  		//The player is facing quadrant 3
  		if (player.vx <= 3 && player.vy <= 3 ){	
  			split_amount_x = ((player.rotation*radiansToDegrees)-180)/90;
  			split_amount_y = 1 - split_amount_x;
  			player.vx -= split_amount_x;
  			player.vy += split_amount_y;
  		}
  	}
  	else if ((player.rotation*radiansToDegrees) > 270){
  		//The player is facing quadrant 4
  		if (player.vx <= 3 && player.vy >= -3 ){
  			split_amount_y = ((player.rotation*radiansToDegrees)-270)/90;
  			split_amount_x = 1 - split_amount_y;
  			player.vx -= split_amount_x;
  			player.vy -= split_amount_y;

  		}
  	}

}
/*
window.addEventListener("keydown", function (e) {
  e.preventDefault();
  	if(e.keyCode == 38){
  		//This is the up arrow
  		//Up arrow needs to increase velocity, its the gas pedal
  		playerAcceleration = 1;
  	}
  	if(e.keyCode == 40){
  		//This is the down arrow
  		//Down arrow will be the brakes/reverse
  	}
 	if (e.keyCode == 87){
 		//This is the W key
 	}
 	else if (e.keyCode == 83){
 		//This is the S key
 	}

  	if (e.keyCode == 65){//This is the A key
  		if ((player.rotation * radiansToDegrees) <= 0){
			player.rotation = 360/radiansToDegrees;
		}
    	player.rotation -= 4/radiansToDegrees;
  	}
	else if (e.keyCode == 68){//This is the D key
		if ((player.rotation * radiansToDegrees) >= 360){
			player.rotation = 0/radiansToDegrees;
		}
  		player.rotation += 4/radiansToDegrees;
	}	
	console.log(e.keyCode);
	
});
*/

var map = []; // Or you could call it "key"
onkeydown = onkeyup = onkeypress = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /*insert conditional here*/
    if(map[38] && map[68]){
    	if ((player.rotation * radiansToDegrees) >= 360){
			player.rotation = 0/radiansToDegrees;
		}
  		player.rotation += 4/radiansToDegrees;
  		playerAcceleration = 1;
    }
    else if(map[38] && map[65]){
    	if ((player.rotation * radiansToDegrees) <= 0){
			player.rotation = 360/radiansToDegrees;
		}
    	player.rotation -= 4/radiansToDegrees;
    	playerAcceleration = 1;
    }
    else if(map[68]){
    	if ((player.rotation * radiansToDegrees) >= 360){
			player.rotation = 0/radiansToDegrees;
		}
  		player.rotation += 4/radiansToDegrees;
    }
    else if(map[65]){
    	if ((player.rotation * radiansToDegrees) <= 0){
			player.rotation = 360/radiansToDegrees;
		}
    	player.rotation -= 4/radiansToDegrees;
    }
}


PIXI.loader
	.add("map_json", "tutorial_map.json")
	.add("tileset", "maptiles2.png")
	.add("racecar", "racecar.png")
	.load(ready);

function ready(){
	let tu = new TileUtilities(PIXI);
	let world = tu.makeTiledWorld("map_json", "maptiles2.png");
	stage.addChild(world);

	var racecar = world.getObject("racecar");

	player = new PIXI.Sprite(PIXI.loader.resources.racecar.texture);
	player.x = racecar.x;
  	player.y = racecar.y;
  	player.vx = 0;
	player.vy = 0;
  	player.anchor.x = 0.5;
 	player.anchor.y = 1.0;
 	player.rotation = playerRotation;

 	var entity_layer = world.getObject("Entities");
  	entity_layer.addChild(player);

  	text = new PIXI.Text('Angle: ',{font : '40px Arial', fill : 0xff1010, align : 'center'});
	text.x = 100;
	text.y = 200;
	stage.addChild(text);

	speedometer = new PIXI.Text('Speed: ',{font : '40px Arial', fill : 0xff1010, align : 'center'});
	speedometer.x = 100;
	speedometer.y = 250;
	stage.addChild(speedometer);


	gaspedal = new PIXI.Sprite(gasP_texture);
	gaspedal.position.x = 1450;
	gaspedal.position.y = 675;
	stage.addChild(gaspedal);

}
stage.x = 0;



function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
	player.x += player.vx;
	player.y += player.vy;
	text.text = "Angle: " + player.rotation*radiansToDegrees;
	speedometer.text = "Speed: X: " + player.vx + " Y: " + player.vy;
	if (playerAcceleration != 0){
		move();
		playerAcceleration = 0;
	}

	if (player.vx > 0){
		player.vx -= player.vx/10;
	}
	if (player.vx < 0){
		player.vx += -player.vx/10;
	}
	if (player.vy > 0){
		player.vy -= player.vy*0.1;
	}
	if (player.vy < 0){
		player.vy += -player.vy*0.1;
	}

	if (stage.x <= 0 && stage.x >= -1400){
		stage.x += -player.vx/1.5;
		if (stage.x < -0.1 && stage.x > -1399.9)
			gaspedal.x += player.vx/0.9;
	}
	else if (stage.x > 0){
		stage.x = -0.1;
	}
	else {
		stage.x = -1399.9
	}

	if (stage.y <= 0 && stage.y >= -840){
		stage.y += -player.vy/1.5;
		gaspedal.y += player.vy/0.9;
	}
	else if (stage.y > 0){
		stage.y = -0.1;
	}
	else {
		stage.y = -839.9
	}

}
animate();