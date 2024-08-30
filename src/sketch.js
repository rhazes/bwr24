let sprite;
let p1, p2, p3, p4;
let ground;

function setup() {
	createCanvas(400,400);
  world.gravity.y = 10;
	
  sprite = createSprite(200, 200,30);
  ground = createSprite(0,400,800,10,'static');

  p1 = createSprite(300,300,70,10, 'static');
  p1 = createSprite(100,330,70,10, 'static');
  p1 = createSprite(200,200,70,10, 'static');



  sprite.friction = 0;
	  noStroke();
}

function draw() {
  background(255);  

  if (sprite.position.y > height-20) {
    sprite.position.y = height-20;
    sprite.velocity.y = 0;
  }

 
  if(keyIsDown(87))
    sprite.y = sprite.y-5;
  if(keyIsDown(65))
    sprite.x = sprite.x-4;
  if(keyIsDown(68))
    sprite.x = sprite.x+5;
  if(keyIsDown(83))
    sprite.x = sprite.x+4;
  if(keyIsDown(32))
    sprite.velocity.x = 0;

  sprite.color = color(200, 0 , 0);
}