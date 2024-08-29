let mario;
let ground;
let platforms;
let endPoint;
let worldSpeed = 5;
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(800, 400);
  world.gravity.y = 9.8;

  mario = new Sprite(100, 300, 30, 50);
  mario.color = 'red';
  mario.addAni('idle', 'assets/mario_idle.png');
  mario.addAni('run', 'assets/mario_run.png', { frameSize: [32, 32], frames: 3 });
  mario.collider = 'dynamic';

  ground = new Sprite(400, height - 20, width, 40);
  ground.collider = 'static';

  platforms = new Group();
  generatePlatforms();

  endPoint = new Sprite(10000, height - 60, 50, 80);
  endPoint.color = 'green';
  endPoint.collider = 'static';
}

function draw() {
  if (gameOver) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text(`Game Over! Score: ${score}`, width / 2, height / 2);
    return;
  }

  background(135, 206, 235);
  
  handleInput();
  updateWorld();
  checkCollisions();
  
  drawSprites();
  
  fill(0);
  textSize(20);
  text(`Score: ${score}`, 20, 30);
}

function handleInput() {
  if (kb.pressing('left') || kb.pressing('a')) {
    mario.vel.x = -5;
    mario.mirror.x = true;
  } else if (kb.pressing('right') || kb.pressing('d')) {
    mario.vel.x = 5;
    mario.mirror.x = false;
  } else {
    mario.vel.x = 0;
  }

  if ((kb.pressed('up') || kb.pressed('w')) && mario.colliding(ground)) {
    mario.vel.y = -12;
  }

  if (kb.pressing('down') || kb.pressing('s')) {
    mario.vel.y += 0.5;
  }

  mario.ani = mario.vel.x !== 0 ? 'run' : 'idle';
}

function updateWorld() {
  camera.x = mario.x + 300;
  
  ground.x = camera.x;
  
  if (frameCount % 60 === 0) {
    generatePlatforms();
  }
  
  platforms.forEach(platform => {
    if (platform.x < camera.x - width / 2) {
      platform.remove();
    }
  });
  
  score = Math.floor(mario.x / 100);
}

function generatePlatforms() {
  let platformX = camera.x + width / 2 + random(100, 300);
  let platformY = random(height - 150, height - 100);
  let platformWidth = random(50, 150);
  
  let platform = new Sprite(platformX, platformY, platformWidth, 20);
  platform.collider = 'static';
  platforms.add(platform);
}

function checkCollisions() {
  if (mario.collides(endPoint)) {
    gameOver = true;
  }
  
  if (mario.y > height + 100) {
    gameOver = true;
  }
}
