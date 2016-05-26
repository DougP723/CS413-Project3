var game_scale = 0.6
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(1000, 600, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.x = 0;
stage.y = 0;
stage.scale.x = game_scale;
stage.scale.y = game_scale;

var titleScreen;
var title_texture = PIXI.Texture.fromImage("titlescreen.png")
var startButton;
var start_texture = PIXI.Texture.fromImage("startbutton.png");
var titleMusic;

var player;
var world;
var wallMapArray;
var hitBox

var gasP_texture = PIXI.Texture.fromImage("gaspedal.png");
var gaspedal;


var HUD = new PIXI.Container();
HUD.x = 1200;
HUD.y = 100;

var timer1;
//The following variables are used to dictate the race car's direction. Since I like using degrees
// but PIXI wants to do radians, I scienced up a formula so that I can still do degrees.
var radiansToDegrees = 180/Math.PI; 
var playerAngle = 90; //The starting angle of the car
var playerRotation = playerAngle/radiansToDegrees;

// Character movement constants:
var topSpeed = 10;
var steeringSensitivity = 5;
var playerDrag = 0.09;
var playerAcceleration = 0;

isIntersecting = function(r1, r2) {
        return !(r2.x-4 > (r1.x-4 + r1.width-4)  || 
           (r2.x-4 + r2.width-4 ) < r1.x-4 || 
           r2.y-4 > (r1.y-4 + r1.height-4) ||
           (r2.y-4 + r2.height-4) < r1.y-4);
}

// The move function starts or continues movement
function move() {
	console.log("move");
  	
  	var split_amount_x;
  	var split_amount_y;
  	if ((player.rotation*radiansToDegrees) <= 90){
  		//The player is facing quadrant 1
  		if (player.vx <= topSpeed && player.vy >= -topSpeed ){
  			split_amount_x = (player.rotation*radiansToDegrees)/90;
  			split_amount_y = 1 - split_amount_x;
  			player.vx += split_amount_x;
  			player.vy -= split_amount_y;

  		}
  	}
  	if ((player.rotation*radiansToDegrees) > 90 && (player.rotation*radiansToDegrees) <= 180){
  		//The player is facing quadrant 2
  		if (player.vx <= topSpeed && player.vy <= topSpeed ){	
  			split_amount_y = ((player.rotation*radiansToDegrees)-90)/90;
  			split_amount_x = 1 - split_amount_y;
  			player.vx += split_amount_x;
  			player.vy += split_amount_y;
  		}
  	}
  	else if ((player.rotation*radiansToDegrees) > 180 && (player.rotation*radiansToDegrees) <= 270){
  		//The player is facing quadrant 3
  		if (player.vx <= topSpeed && player.vy <= topSpeed ){	
  			split_amount_x = ((player.rotation*radiansToDegrees)-180)/90;
  			split_amount_y = 1 - split_amount_x;
  			player.vx -= split_amount_x;
  			player.vy += split_amount_y;
  		}
  	}
  	else if ((player.rotation*radiansToDegrees) > 270){
  		//The player is facing quadrant 4
  		if (player.vx <= topSpeed && player.vy >= -topSpeed ){
  			split_amount_y = ((player.rotation*radiansToDegrees)-270)/90;
  			split_amount_x = 1 - split_amount_y;
  			player.vx -= split_amount_x;
  			player.vy -= split_amount_y;

  		}
  	}

}

window.addEventListener("keydown", function (e) {
  e.preventDefault();

  	if (e.keyCode == 65){//This is the A key
  		if ((player.rotation * radiansToDegrees) <= 0){
			player.rotation = 360/radiansToDegrees;
		}
    	player.rotation -= steeringSensitivity/radiansToDegrees;
  	}
	else if (e.keyCode == 68){//This is the D key
		if ((player.rotation * radiansToDegrees) >= 360){
			player.rotation = 0/radiansToDegrees;
		}
  		player.rotation += steeringSensitivity/radiansToDegrees;
	}	
	console.log(e.keyCode);
	
});

function mouseHandler(e){
	if (e.type == "mousedown"){
		playerAcceleration = 1;
		console.log("hold");
	}
	else {
		playerAcceleration = 0;
	}
}

function startGame(e){
	gameStart = 1;
}

PIXI.loader
	.add("music.mp3")
	.add("map_json", "tutorial_map.json")
	.add("tileset", "maptiles2.png")
	.add("racecar", "racecar.png")
	.load(ready);

function ready(){
	let tu = new TileUtilities(PIXI);
	let world = tu.makeTiledWorld("map_json", "maptiles2.png");
	stage.addChild(world);


	var racecar = world.getObject("racecar");
	racecar.witdh = 50;
	racecar.height = 100;

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

	timer1 = new PIXI.Text('Lap1: --:--',{font : '40px Arial', fill : 0x000000, align : 'center'});
	timer1.x = 0;
	timer1.y = 0;
	timer1.alpha = 0;
	HUD.addChild(timer1);

	gaspedal = new PIXI.Sprite(gasP_texture);
	gaspedal.position.x = 25;
	gaspedal.position.y = 675;
	gaspedal.alpha = 0;
	gaspedal.interactive = false;
	gaspedal.on('mousedown', mouseHandler);
	gaspedal.on('mouseup', mouseHandler);
	//gaspedal.on('click', mouseHandler);
	stage.addChild(gaspedal);
	stage.addChild(HUD);

	wallMapArray = world.getObject("wallLayer").data;

	titleScreen = new PIXI.Sprite(title_texture);
	titleScreen.position.x = 0;
	titleScreen.position.y = 0;
	titleScreen.anchor.x = 0;
	titleScreen.anchor.y = 0;
	stage.addChild(titleScreen);

	startButton = new PIXI.Sprite(start_texture);
	startButton.position.x = 700;
	startButton.position.y = 700;
	startButton.interactive = true;
	startButton.on('mousedown', startGame);
	stage.addChild(startButton);

	titleMusic = PIXI.audioManager.getAudio("music.mp3");

}


var count = 0;
var clock1 = 0;
var gameStart = 0;
function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);

	if (gameStart == 0){
		titleMusic.play();
	}

	if (gameStart == 1){
		titleScreen.alpha = 0;
		startButton.alpha = 0;
		titleMusic.stop();

		gaspedal.alpha = 1;
		gaspedal.interactive = true;
		timer1.alpha = 1;

		count++;
	}

	if (gameStart == 0){

	}

	player.x += player.vx;
	player.y += player.vy;

	if (count == 1){
		count = 0;
		clock1 += 0.02;
		timer1.text = "Lap1: " + clock1.toFixed(2);
	}
	if (playerAcceleration != 0){
		move();
		//playerAcceleration = 0;
	}

	//This section of code will slow the car down if the player is not giving it gas
	if (player.vx > 0){
		player.vx -= player.vx*playerDrag;
	}
	if (player.vx < 0){
		player.vx += -player.vx*playerDrag;
	}
	if (player.vy > 0){
		player.vy -= player.vy*playerDrag;
	}
	if (player.vy < 0){
		player.vy += -player.vy*playerDrag;
	}

	//This code will move the hud elements around with the screen
	if (stage.x <= 0 && stage.x >= -1400){
		stage.x += -player.vx/2;
		if (stage.x < -0.1 && stage.x > -1399.9){
			gaspedal.x += player.vx/1.2;
			HUD.x += player.vx/1.2;
		}
	}
	else if (stage.x > 0){
		stage.x = -0.1;
	}
	else {
		stage.x = -1399.9
	}

	if (stage.y <= 0 && stage.y >= -840){
		stage.y += -player.vy/2;
		if (stage.y < -0.1 && stage.y > -839.9){
			gaspedal.y += player.vy/1.2;
			HUD.y += player.vy/1.2;
		}
	}
	else if (stage.y > 0){
		stage.y = -0.1;
	}
	else {
		stage.y = -839.9
	}

	//COLISION DETECTION
	for (var j in wallMapArray){
		var wall = wallMapArray[j];
		if(isIntersecting(racecar, wall)){
		
		}
	}
}
animate();