let sprite;
let p1, p2, p3;
let ground;
let curPlatform;
let helicopter;
let backdrop;
let levelLength = 5000
let xoffset = 0;
let platforms;
let game_end_x
let plats = [

]

let forestFireSound; // Declare a variable for the sound
let soundStarted = false; // Track if the sound has started (default is off)
let invincible = false; // Track if the player is invincible
let fireAni;
let antagonistGroup;

function preload() {
  backdrop = loadImage('images/Arrowhead full canvas.png');
  helicopter = loadImage('images/heli.png');
  forestFireSound = loadSound('audio/Forest Fire Sound Effect (Copyright Free).mp3'); // Load the sound

  fireAni = loadAnimation("images/fire.png", 
    {frameSize:[180,176], frames:5});
  fireAni.frameDelay = 10; // 4 is default; 1 is fastest
}

function setup() {
  randomSeed(55); // 99
	createCanvas(1920,1080);
  rectMode(CENTER);

  game_end_x = 12000;
  for(let i = 150; i < game_end_x; i+= 150) {
    let one_fifth = game_end_x * (1/5);
    let two_fifth = game_end_x * (2/5);
    let three_fifth = game_end_x * (3/5);
    let four_fifth = game_end_x * (4/5);
    
    if(i < one_fifth) {
        plats.push([i+(one_fifth/5), random(140,380), random(70,140)]);
        plats.push([i-(one_fifth/5), random(140,380), random(70,140)]);
      
    }
    else if(i < two_fifth) {
      if(random(0,10) > 5) {
        plats.push([i+(one_fifth/5), random(140,380), random(60,120)]);
      }
      if(random(0,10) > 5) {
        plats.push([i-(one_fifth/5), random(140,380), random(60,120)]);
      }
    }
    else if(i < three_fifth) {
      if(random(0,10) < 3) {
        plats.push([i+(one_fifth/5), random(140,380), random(40,80)]);
      }
      if(random(0,10) < 3) {
        plats.push([i-(one_fifth/5), random(140,380), random(40,80)]);
      }
    }
    else if(i < four_fifth) {
      if(random(0,10) < 3) {
        plats.push([i+(one_fifth/5), random(300,380), random(40,50)]);
      }
      if(random(0,10) < 3) {
        plats.push([i-(one_fifth/5), random(300,380), random(40,50)]);
      }
    }
    else {
      if(random(0,10) < 8) {
        plats.push([i, random(300,380), random(10,20)]);
        i -= 200;
      }
    }
  }

  world.gravity.y = 5; // Reduced from 7
	
  sprite = createSprite(500, 200,30);
  ground = createSprite(500,400,50000,10,'static');

  // Create initial platforms
  platforms = new Group();
	platforms.h = 15;
	platforms.w = 50;
	platforms.color = 'green';
	
	platformCount = 10;
	for (let i=0; i < plats.length; ++i) {
      if(i != 13 &&  i != 18 && i!= 6 && i!= 12 && i!= 20 && i!= 23 && i!= 14 && i!= 16 && i!= 2 && i!= 36 && i!= 37 && i!= 47) {
			  let p = new platforms.Sprite(plats[i][0],plats[i][1], plats[i][2], 15);
        p.collider = 'static';
      }
      else {
        let p = new platforms.Sprite(0,0,0,0)
      }
	}

  sprite.friction = 0;
	  noStroke();

  createAntagonists();
  spawnAntagonist(100,100);

  helicopter = createSprite(3800, 100, 60, 30);
  helicopter.shapeColor = color(0, 255, 0);

  forestFireSound.setLoop(true);
  soundStarted = false; // Initialize as not started, but we'll change this soon
}



function spawnAntagonist(x,y) {
  let a = new antagonistGroup.Sprite(x,y);
  a.speed = 5; //random(-3,-3);
  a.direction = 180;
  a.scale.x = 0.5;
  a.scale.y = 0.5;
  a.life = 300;
}

function createAntagonists() {//creates antagonists
  antagonistGroup = new Group();
  antagonistGroup.addAni(fireAni); 
  antagonistGroup.diameter = 100;
}


function platformOn() {
  for(let i = 0; i < platforms.length; i++) {
    if(sprite.collide(platforms[i])) {
      return i;
    }
  }
  return -1;
}

function draw() {
  background('gray');
  
  let temp = platformOn();
  if(temp != -1) {
    print(temp);
  }

  // Calculate the height to maintain aspect ratio
  let backdropWidth = 7046; // Use the actual width of your image
  let backdropHeight = (backdropWidth / 7046) * 720; // Maintain original aspect ratio

  // Draw the backdrop image tiled
  let startX = -camera.position.x % backdropWidth;
  for (let x = startX; x < width; x += backdropWidth) {
    image(backdrop, x, 0, backdropWidth, backdropHeight);
  }

  screenX = sprite.position.x + 200;
    
  camera.position.x = sprite.position.x;
  camera.moveTo(sprite.position.x, 540);

  if (sprite.position.y > height - 20) {
    sprite.position.y = height - 20;
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

  // // Update and check collision for all antagonists
  // for (let i = antagonists.length - 1; i >= 0; i--) {
  //   updateAntagonist(antagonists[i]);
    
  //   if (!invincible && sprite.collide(antagonists[i])) { // Check invincibility
  //     gameOver("An antagonist got you!");
  //     return;  // Stop the game loop
  //   }
  // }
  // for (let i = antagonists.length - 1; i >= 0; i--) {
  //   updateAntagonist(antagonists[i]);
    
  //   if (sprite.collide(antagonists[i])) {
  //     let spriteBottom = sprite.position.y + sprite.height/2;
  //     let antagonistTop = antagonists[i].position.y - antagonists[i].height/2;
      
  //     if (spriteBottom <= antagonistTop + 10) {  // Allow for a small overlap
  //       // Player is on top of the antagonist
  //       antagonists[i].remove();
  //       antagonists.splice(i, 1);
  //       console.log("You defeated an antagonist!");
  //       // Add a small upward bounce
  //       sprite.velocity.y = -5;
  //     } else {
  //       // Player hit the antagonist from the side or below
  //       gameOver("An antagonist got you!");
  //       return;  // Stop the game loop
  //     }
  //   }
  // }

  // Check for collision with helicopter
  if (sprite.collide(helicopter)) {
    winGame("You reached the helicopter!");
  }

  // Display player coordinates
  displayPlayerCoordinates();

  // Display sound state
  push();
  textAlign(LEFT, TOP);
  textSize(16);
  fill(0);
  text(`Sound: ${soundStarted ? (forestFireSound.isPlaying() ? "Playing" : "Paused") : "Off"}`, 
       camera.position.x - width/2 + 10, camera.position.y - height/2 + 10);
  pop();

  if (!soundStarted) {
    push();
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(255);
    text("Click anywhere or press 'M' to start sound", width/2, height/2);
    pop();
  }
}

function keyPressed() {
  // Prevent default space bar behavior
  if (key === ' ') {
    return false; // Prevent scrolling down
  }

  // Toggle sound on "M" key press
  if (key === 'm' || key === 'M') {
    if (!soundStarted) {
      startSound();
    } else {
      if (forestFireSound.isPlaying()) {
        forestFireSound.pause();
      } else {
        forestFireSound.play();
      }
    }
  }

  // Make player invincible on "I" key press
  if (key === 'i' || key === 'I') {
    invincible = !invincible; // Toggle invincibility
    console.log(`Invincibility: ${invincible}`);
  }

  // Debug When D is pressed
  if (key === 'd' || key === 'D') {
    player.toggleDebugMode();
  }
}

// function updateAntagonist(antagonist) {
//   if (antagonist && !antagonist.removed) {
//     // Random movement
//     if (frameCount % 60 === 0) {
//       antagonist.velocity.x = random(-5, 5);
//     }

//     // Keep on ground
//     antagonist.collide(ground);



//     // Prevent flipping over
//     antagonist.rotation = 0;
//   }
// }

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
function startSound() {
  if (!soundStarted) {
    forestFireSound.play();
    soundStarted = true;
  }
}

function mousePressed() {
  startSound();
}

