function setup() {
	new Canvas(400, 400);

	sprite = new Sprite();
	sprite.diameter = 200;
  noStroke();
}

function draw() {
  background(250);  
  sprite.x =  0.5 * frameCount % width;
  if(frameCount % 30 == 0) {
    sprite.y = random(height);
  }
  sprite.color = color(random(255),0,0);
}

let sprite;
