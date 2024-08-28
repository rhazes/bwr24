function setup() {
	new Canvas(400, 400);
	
	sprite = new Sprite();
	sprite.diameter = 30;

  platform = new Sprite();
  platform.width = 60;
  platform.length = 10;


	  noStroke();
	  world.gravity.y = 1;
}

function draw() {
  platform.y = 360;
  platform.x = 40;
  platform.immovable = true;
  platform.rotationLock = true;

  background(255);  
  //sprite.x =  0.5 * frameCount % width;
  if(key == 'w') {
    sprite.y = sprite.y-5;

  }
  
  if(key == 'a') {
    sprite.x = sprite.x-4;
  }

  if(key == 'd') {
    sprite.x = sprite.x+4;
  }

  if(key == 's') {
    sprite.y = sprite.y+5;
  }

  if(sprite.y > 380) {
    sprite.y = sprite.y-20;
  }

  sprite.color = color(200, 0 , 0);
}

let sprite;
