var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(1000, 600, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var texture = PIXI.Texture.fromImage("testguy.png");
var sprite = new PIXI.Sprite(texture);
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;
sprite.position.x = 700;
sprite.position.y = 50;
stage.addChild(sprite);

var arrow_texture = PIXI.Texture.fromImage("testarrow.png");
var arrow = new PIXI.Sprite(arrow_texture);
arrow.position.x = 100;
arrow.position.y = 500;
stage.addChild(arrow);




function mouseHandler(e) {

		var projectile_x = arrow.position.x;
	var projectile_y = arrow.position.y;
	var target_x = sprite.position.x;
	var target_y = sprite.position.y;

	var a;
	var b;
	var c;
	var p_velocity;
	var t_velocity = movement;
	if (target_y - projectile_y < 0){
		a = projectile_y - target_y;
	}
	else{
		a = target_y - projectile_x;
	}

	if (target_x - projectile_x < 0){
		b = projectile_x - target_x;
	}
	else{
		b = target_x - projectile_x;
	}

	c = Math.sqrt((a*a)+(b*b));
	p_velocity = c/1000; //This will calculate the pixels per second that the projectile is traveling

	var new_x = sprite.position.x;
	var new_y = sprite.position.y;
	createjs.Tween.get(arrow.position).to({x: new_x, y: new_y}, c);


}
var movement = 2;

function moveTarget(){
	var speed = 2000;
	createjs.Tween.get(sprite, {loop: true}).to({x: 700, y: 550}, speed, createjs.Ease.getPowInOut(4)).to({x: 700, y: 50}, speed, createjs.Ease.getPowInOut(4));
}

moveTarget();
var moving = 0;
arrow.interactive = true;
arrow.on('mousedown', mouseHandler);

function animate(time) {
	requestAnimationFrame(animate);
	renderer.render(stage);
	TWEEN.update(time);
}

function updateBox( box, params ) {
	var s = box.style,
	transform = 'translateY(' + Math.round(params.y) + 'px) rotate(' + Math.floor( params.rotation ) + 'deg)';
	s.webkitTransform = transform;
	s.mozTransform = transform;
	s.transform = transform;
}
animate();