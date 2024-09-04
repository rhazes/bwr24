let sprite;
let p1, p2, p3;
let ground;
let platforms = [];
let curPlatform;

function setup() {
	createCanvas(1920,1080);
  rectMode(CENTER);

  world.gravity.y = 10;
	
  sprite = createSprite(500, 200,30);
  ground = createSprite(500,400,10000,10,'static');

  // Create initial platforms
  createPlatform(300, 300, 70, 10);
  createPlatform(100, 330, 70, 10);
  createPlatform(200, 200, 70, 10);

  // Add more platforms
  createPlatform(400, 250, 100, 10);
  createPlatform(600, 280, 80, 10);
  createPlatform(800, 220, 90, 10);
  createPlatform(1000, 300, 110, 10);
  createPlatform(1200, 180, 75, 10);

  sprite.friction = 0;
	  noStroke();
}

function createPlatform(x, y, width, height) {
  let platform = createSprite(x, y, width, height, 'static');
  platforms.push(platform);
  return platform;
}

function platformOn() {
  for(i = 0; i < platforms.length; i++) {
    if(sprite.collide(platforms[i])) {
      return i;
    }
  }
  return -1;
}

function draw() {
  background(255);
  screenX=sprite.position.x+200;
    
  camera.position.x = sprite.position.x;
  camera.moveTo(sprite.position.x,540);

  if (sprite.position.y > height-20) {
    sprite.position.y = height-20;
    sprite.velocity.y = 0;
  }

 
  // Left and right movement
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // 65 is the keyCode for 'A'
    sprite.velocity.x = -5;
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // 68 is the keyCode for 'D'
    sprite.velocity.x = 5;
  } else {
    sprite.velocity.x = 0;
  }

  // Jumping
  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && (sprite.collide(allSprites))) { // 87 is the keyCode for 'W'
    
      sprite.velocity.y = -15;
  }

  // Apply gravity
  sprite.velocity.y += 0.8;

  // Limit falling speed
  if (sprite.velocity.y > 15) {
    sprite.velocity.y = 15;
  }

  // Collision with ground
  sprite.collide(ground);

  sprite.color = color(200, 0, 0);
}

function keyPressed() {
    // Debug When D is pressed
    if (key === 'd' || key === 'D') {
        player.toggleDebugMode();
    }
}
