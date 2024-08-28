function setup() {
	new Canvas(400, 400);
	
	sprite = new Sprite();
	sprite.diameter = 30;

	  noStroke();
	  world.gravity.y = 1;
}

function draw() {
<<<<<<< HEAD
  background(255);  
  //sprite.x =  0.5 * frameCount % width;
  if(key == 'w') {
    sprite.y = sprite.y-5;
=======
  background(250);  
  sprite.x =  0.5 * frameCount % width;
  if(frameCount % 30 == 0) {
    sprite.y = random(height);
>>>>>>> 81be04138b467787eac0491f743a4934f23966f1
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
