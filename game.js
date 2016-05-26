var game_scale = 0.5
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(1000, 600, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = game_scale;
stage.scale.y = game_scale;

var player;
var world;

//The following variables are used to dictate the race car's direction. Since I like using degrees
// but PIXI wants to do radians, I scienced up a formula so that I can still do degrees.
var radiansToDegrees = 180/Math.PI; 
var playerAngle = 90;
var playerRotation = playerAngle/radiansToDegrees;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

// The move function starts or continues movement
function move() {
  if (player.direction == MOVE_NONE) {
    player.moving = false;
    console.log(player.y);
    return;
  }
  player.moving = true;
  console.log("move");
  
  if (player.direction == MOVE_LEFT) {
  	player.position.x -= 1;
    //createjs.Tween.get(player).to({x: player.x - 32}, 500).call(move);
  }
  if (player.direction == MOVE_RIGHT)
    player.position.x += 1;

  if (player.direction == MOVE_UP)
    createjs.Tween.get(player).to({y: player.y - 32}, 500).call(move);
  
  if (player.direction == MOVE_DOWN)
    createjs.Tween.get(player).to({y: player.y + 32}, 500).call(move);
}

window.addEventListener("keydown", function (e) {
  e.preventDefault();
  
  	if(e.keyCode == 38){
  		//This is the up arrow
  	}
  	if(e.keyCode == 40){
  		//This is the down arrow
  	}
 	if (e.keyCode == 87){
 		//This is the W key
 	}
 	else if (e.keyCode == 83){
 		//This is the S key
 	}
  	else if (e.keyCode == 65){//This is the A key
    	player.rotation -= 4/radiansToDegrees;
  	}
	else if (e.keyCode == 68){//This is the D key
  		player.rotation += 4/radiansToDegrees;
	}	
	console.log(e.keyCode);
	move();
});

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
  	player.anchor.x = 0.0;
 	player.anchor.y = 1.0;
 	player.rotation = playerRotation;

 	var entity_layer = world.getObject("Entities");
  	entity_layer.addChild(player);
}



var texture = PIXI.Texture.fromImage("racecar.png");
var sprite = new PIXI.Sprite(texture);
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;
sprite.position.x = 700;
sprite.position.y = 50;
stage.addChild


function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
}
animate();