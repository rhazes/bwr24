let sprite;
let p1, p2, p3, p4;
let ground;
let platforms = [];
let curPlatform;

function setup() {
	createCanvas(400,400);
  rectMode(CENTER);

  world.gravity.y = 10;
	
  sprite = createSprite(500, 200,30);
  ground = createSprite(500,400,10000,10,'static');

  p1 = createSprite(300,300,70,10, 'static');
  p2 = createSprite(100,330,70,10, 'static');
  p3 = createSprite(200,200,70,10, 'static');

  platforms.push(p1,p2,p3);



  sprite.friction = 0;
	  noStroke();
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
  camera.moveTo(sprite.position.x,200);

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
    curPlatform = platformOn();
    if(curPlatform > 0)
      print(platforms[curPlatform].position.y);
      print(sprite.position.y);
    if(curPlatform > 0 && sprite.position.y+25 > platforms[curPlatform].position.y || sprite.collide(ground))
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
