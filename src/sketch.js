let sprite;
let p1, p2, p3;
let ground;
let curPlatform;
let helicopter;
let backdrop;
let levelLength = 5000
let xoffset = 0;
let platforms;
let game_end_x = 12000
let fps;
let plats = [

]

let forestFireSound;
let soundStarted = false;
let invincible = false;
let fireAni;
let antagonistGroup;
let antagonistSpawnCycle = [80,60,50,30];
let antagonistSpawnHeight = [-50,200,300];
let antagonistSpawnIndex = 0;
let spawnIntervalFactor = Math.floor(game_end_x / antagonistSpawnCycle.length);
let antagonistLife = 500;

let gameOverPopup;
let spriteImage;
let spriteSheet;

let spriteYOffset = 500;

function preload() {
  backdrop = loadImage('images/Arrowhead full canvas.png');
  helicopter = loadImage('images/heli.png');
  forestFireSound = loadSound('audio/Forest Fire Sound Effect (Copyright Free).mp3');

  fireAni = loadAnimation("images/fire.png", 
    {frameSize:[180,176], frames:5});
  fireAni.frameDelay = 10;
  
  spriteImage = loadImage('images/sprite.png');
}

function setup() {
  randomSeed(55);
  createCanvas(1920,1080);
  rectMode(CENTER);
  frameRate(60)
  fps = 0;

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

  world.gravity.y = 5;
  
  // Calculate sprite dimensions
  let spriteWidth = spriteImage.width * 0.2;
  let spriteHeight = spriteImage.height * 0.2;

  // Create sprite with correct dimensions and position
  sprite = new Sprite(100, 400 - spriteHeight / 2, spriteWidth, spriteHeight);
  sprite.addImage(spriteImage);
  sprite.scale = 0.2;
  
  // Set origin to bottom center
  sprite.origin = { x: 0.5, y: 1 };

  // Remove this line
  // sprite.y -= spriteYOffset;

  // Add this line to adjust the image offset
  sprite.ani.offset.y = -100;

  sprite.friction = 0;
  sprite.rotationLock = true;

  ground = createSprite(500,400,50000,10,'static');
  
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

  noStroke();

  createAntagonists();

  sprite.collides(antagonistGroup, antagonistCollision);

  helicopter = createSprite(3800, 100, 60, 30);
  helicopter.shapeColor = color(0, 255, 0);
  helicopter.speed = 0;
  helicopter.rotationLock = true;

  forestFireSound.setLoop(true);
  soundStarted = false;

  gameOverPopup = createDiv('');
  gameOverPopup.class('game-over-popup');
  gameOverPopup.hide();
}

function antagonistCollision(player, fire) {
  let spriteBottom = player.position.y + player.height/2;
  let antagonistTop = fire.position.y - fire.height/2;
  if (spriteBottom <= antagonistTop + 10) {
    fire.remove();
  } else {
    gameOver("You didn't make it!!");
  }
}

function spawnAntagonist() {
  let xRegion = floor(sprite.x / spawnIntervalFactor);
  xRegion = constrain(xRegion,0,antagonistSpawnCycle.length);

  if(frameCount % antagonistSpawnCycle[xRegion] == 0) {
    let motion = random([-2,-1.5,-1.0,-0.5,0.5,1.0,1.5,2.0]); 
    let _x = sprite.x + 400; 
    let _y = antagonistSpawnHeight[antagonistSpawnIndex % antagonistSpawnHeight.length];

    let a = new antagonistGroup.Sprite(_x,_y);

    a.speed = Math.sign(motion) * 2;
    a.direction = 180;
    a.scale.x = 0.5;
    a.scale.y = 0.5;
    a.motion = motion;
    a.update = () => {
      a.x -= a.motion;
    }

    antagonistSpawnIndex++;
  }
}

function createAntagonists() {
  antagonistGroup = new Group();
  antagonistGroup.addAni(fireAni); 
  antagonistGroup.diameter = 100;
  antagonistGroup.rotationLock = true;
  antagonistGroup.overlaps(antagonistGroup); 
  antagonistGroup.life = antagonistLife; 
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
  fps = Math.round(frameRate());

  let backdropWidth = 7046;
  let backdropHeight = (backdropWidth / 7046) * 720;

  let startX = -camera.position.x % backdropWidth;
  for (let x = startX; x < width; x += backdropWidth) {
    image(backdrop, x, 0, backdropWidth, backdropHeight);
  }

  screenX = sprite.position.x + 200;
    
  if (sprite.position.y > height - 20) {
    sprite.position.y = height - 20;
    sprite.velocity.y = 0;
  }

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    sprite.velocity.x = -5;
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    sprite.velocity.x = 5;
  } else {
    sprite.velocity.x = 0;
  }

  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && (sprite.collide(allSprites))) {
    sprite.velocity.y = -12;
  }

  sprite.velocity.y += 0.5;

  if (sprite.velocity.y > 12) {
    sprite.velocity.y = 12;
  }

  sprite.collide(ground);

  sprite.color = color(200, 0, 0);

  spawnAntagonist();

  if (sprite.collide(helicopter)) {
    winGame("You reached the helicopter!");
  }

  camera.position.x = sprite.position.x;
  camera.moveTo(sprite.position.x, 540);

  updateSpriteDirection();
}

function updateSpriteDirection() {
  if (sprite.velocity.x < 0) {
    sprite.mirror.x = true;
  } else if (sprite.velocity.x > 0) {
    sprite.mirror.x = false;
  }
}

function keyPressed() {
  if (key === ' ') {
    return false;
  }

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

  if (key === 'i' || key === 'I') {
    invincible = !invincible;
    console.log(`Invincibility: ${invincible}`);
  }
}

function gameOver(message) {
  noLoop();
  
  gameOverPopup.html(`
    <h2>Game Over</h2>
    <p>${message}</p>
    <button onclick="refreshGame()">Restart Game</button>
  `);
  gameOverPopup.show();
}

function refreshGame() {
  gameOverPopup.hide();
  sprite.position.x = 100;
  sprite.position.y = 200;
  loop();
}

function winGame(message) {
  noLoop();
  
  gameOverPopup.html(`
    <h2>You Win!</h2>
    <p>${message}</p>
    <button onclick="refreshGame()">Play Again</button>
  `);
  gameOverPopup.show();
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

