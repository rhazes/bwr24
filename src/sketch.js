let sprite;
let p1, p2, p3;
let ground;
let platforms = [];
let curPlatform;
let antagonists = [];
let helicopter;
let backdrop;

function preload() {
  backdrop = loadImage('images/Arrowhead full canvas.png');
  helicopter = loadImage('images/heli.png');
}

function setup() {
	createCanvas(1920,1080);
  rectMode(CENTER);

  world.gravity.y = 5; // Reduced from 7
	
  sprite = createSprite(500, 200,30);
  ground = createSprite(500,400,10000,10,'static');

  // Create initial platforms
  createPlatform(300, 300, 70, 10);
  createPlatform(100, 330, 70, 10);
  createPlatform(200, 200, 70, 10);
  createPlatform(400, 250, 100, 10);
  createPlatform(600, 280, 80, 10);
  createPlatform(800, 220, 90, 10);
  createPlatform(1000, 300, 110, 10);
  createPlatform(1200, 180, 75, 10);
  createPlatform(1400, 260, 85, 10);
  createPlatform(1600, 220, 95, 10);
  createPlatform(1800, 290, 100, 10);
  createPlatform(2000, 200, 80, 10);
  createPlatform(2200, 270, 90, 10);
  createPlatform(2400, 230, 105, 10);
  createPlatform(2600, 280, 75, 10);
  createPlatform(2800, 210, 85, 10);
  createPlatform(3000, 250, 95, 10);
  createPlatform(3200, 190, 100, 10);
  createPlatform(3400, 240, 80, 10);
  createPlatform(3600, 220, 90, 10);

  sprite.friction = 0;
	  noStroke();

  createAntagonists();

  helicopter = createSprite(3800, 100, 60, 30);
  helicopter.shapeColor = color(0, 255, 0);
}

function createPlatform(x, y, width, height) {
  let platform = createSprite(x, y, width, height, 'static');
  platforms.push(platform);
  return platform;
}

function createAntagonists() {
  for (let i = 0; i < 10; i++) {
    let x = random(1000, 3500);
    
    let antagonist = createSprite(x, 210, 30, 30);    
    antagonist.shapeColor = color(0, 0, 200);
    antagonist.velocity.x = random(-3, 3);
    antagonists.push(antagonist);
  }
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
  image(backdrop, 0, 0, width, height);
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
    sprite.velocity.y = -12; // Increased jump velocity
  }

  // Apply gravity
  sprite.velocity.y += 0.5; // Reduced from 0.8

  // Limit falling speed
  if (sprite.velocity.y > 12) { // Reduced from 15
    sprite.velocity.y = 12;
  }

  // Collision with ground
  sprite.collide(ground);

  sprite.color = color(200, 0, 0);

  // Update and check collision for all antagonists
  for (let i = antagonists.length - 1; i >= 0; i--) {
    updateAntagonist(antagonists[i]);
    
    if (sprite.collide(antagonists[i])) {
      let spriteBottom = sprite.position.y + sprite.height/2;
      let antagonistTop = antagonists[i].position.y - antagonists[i].height/2;
      
      if (spriteBottom <= antagonistTop + 10) {  // Allow for a small overlap
        // Player is on top of the antagonist
        antagonists[i].remove();
        antagonists.splice(i, 1);
        console.log("You defeated an antagonist!");
        // Add a small upward bounce
        sprite.velocity.y = -5;
      } else {
        // Player hit the antagonist from the side or below
        gameOver("An antagonist got you!");
        return;  // Stop the game loop
      }
    }
  }

  // Check for collision with helicopter
  if (sprite.collide(helicopter)) {
    winGame("You reached the helicopter!");
  }

  // Display player coordinates
  displayPlayerCoordinates();
}

function keyPressed() {
    // Debug When D is pressed
    if (key === 'd' || key === 'D') {
        player.toggleDebugMode();
    }
}

function updateAntagonist(antagonist) {
  if (antagonist && !antagonist.removed) {
    // Random movement
    if (frameCount % 60 === 0) {
      antagonist.velocity.x = random(-5, 5);
    }

    // Keep on ground
    antagonist.collide(ground);



    // Prevent flipping over
    antagonist.rotation = 0;
  }
}

function gameOver(message) {
  // Handle game over state
  console.log("Game Over: " + message);
  noLoop();
  
  // Display game over message on screen
  textAlign(CENTER);
  textSize(32);
  fill(255, 0, 0);
  text("Game Over: " + message, width / 2, height / 2);
}

function winGame(message) {
  // Handle win state
  console.log("You Win: " + message);
  noLoop();
  
  // Display win message on screen
  textAlign(CENTER);
  textSize(32);
  fill(0, 255, 0);
  text("You Win: " + message, width / 2, height / 2);
}

function displayPlayerCoordinates() {
  // Save current drawing settings
  push();
  
  // Set text properties
  textAlign(RIGHT, TOP);
  textSize(16);
  fill(0);  // Black text
  
  // Get player coordinates
  let playerX = Math.round(sprite.position.x);
  let playerY = Math.round(sprite.position.y);
  
  // Display coordinates in top right corner
  // Adjust these values if needed to fit your camera setup
  text(`X: ${playerX}\nY: ${playerY}`, camera.position.x + width/2 - 10, camera.position.y - height/2 + 10);
  
  // Restore original drawing settings
  pop();
}
