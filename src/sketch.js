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
let spriteImage, heliImage;

// Add these variables at the top of your file, with the other let declarations
let hoverAmplitude = 30; // Maximum pixels to move up or down
let hoverSpeed = 0.07; // Adjust this to change the speed of the hover

let jumpCount = 0;

function preload() {
  backdrop = loadImage('images/Arrowhead full canvas.png');
  heliImage = loadImage('images/heli.png');
  spriteImage = loadImage('images/sprite.png');
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

  // Update helicopter creation
  let heliWidth = heliImage.width * 0.5;  // Adjust scale as needed
  let heliHeight = heliImage.height * 0.5;
  helicopter = new Sprite(3800, 100, heliWidth, heliHeight);
  helicopter.addImage(heliImage);
  helicopter.scale = 0.5;  // Adjust this value to fit your game
  helicopter.rotationLock = true;

  // Ensure the sprite uses the image dimensions
  helicopter.width = heliImage.width * helicopter.scale;
  helicopter.height = heliImage.height * helicopter.scale;

  forestFireSound.setLoop(true);
  soundStarted = false;

  gameOverPopup = createDiv('');
  gameOverPopup.class('game-over-popup');
  gameOverPopup.hide();

  // Add these variables at the top of your file, with the other let declarations
  let hoverAmplitude = 20; // Maximum pixels to move up or down
  let hoverSpeed = 0.05; // Adjust this to change the speed of the hover

  // In the setup() function, after creating the helicopter sprite, add:
  helicopter.originalY = helicopter.y; // Store the original Y position

  // Remove these lines as onCollide doesn't exist:
  // sprite.onCollide(ground, resetJumpCount);
  // sprite.onCollide(platforms, resetJumpCount);
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

  /*
  HERE YOU WILL ADD THE CODE FOR THE MOVEMENT OF THE SPRITE

























  
  */

  // Add these lines to check for collisions and reset jump count
  if (sprite.collide(ground) || sprite.collide(platforms)) {
    jumpCount = 0;
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

  // Helicopter hovering effect
  let hoverOffset = sin(frameCount * hoverSpeed) * hoverAmplitude;
  helicopter.y = helicopter.originalY + hoverOffset;
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

/* globals ADD, ALT, ARROW, AUDIO, AUTO, AXES, BACKSPACE, BASELINE, BEVEL, BEZIER, BLEND, BLUR, BOLD, BOLDITALIC, BOTTOM, BURN, CENTER, CHORD, CLAMP, CLOSE, CONTROL, CORNER, CORNERS, CROSS, CURVE, DARKEST, DEGREES, DEG_TO_RAD, DELETE, DIFFERENCE, DILATE, DODGE, DOWN_ARROW, ENTER, ERODE, ESCAPE, EXCLUSION, FALLBACK, FILL, GRAY, GRID, HALF_PI, HAND, HARD_LIGHT, HSB, HSL, IMAGE, IMMEDIATE, INVERT, ITALIC, LABEL, LANDSCAPE, LEFT, LEFT_ARROW, LIGHTEST, LINEAR, LINES, LINE_LOOP, LINE_STRIP, MIRROR, MITER, MOVE, MULTIPLY, NEAREST, NORMAL, OPAQUE, OPEN, OPTION, OVERLAY, P2D, PI, PIE, POINTS, PORTRAIT, POSTERIZE, PROJECT, QUADRATIC, QUADS, QUAD_STRIP, QUARTER_PI, RADIANS, RADIUS, RAD_TO_DEG, REMOVE, REPEAT, REPLACE, RETURN, RGB, RIGHT, RIGHT_ARROW, ROUND, SCREEN, SHIFT, SOFT_LIGHT, SQUARE, STROKE, SUBTRACT, TAB, TAU, TESS, TEXT, TEXTURE, THRESHOLD, TOP, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, TWO_PI, UP_ARROW, VIDEO, WAIT, WEBGL, accelerationX, accelerationY, accelerationZ, deltaTime, deviceOrientation, displayHeight, displayWidth, focused, frameCount, height, isKeyPressed, key, keyCode, keyIsPressed, mouseButton, mouseIsPressed, mouseX, mouseY, movedX, movedY, pAccelerationX, pAccelerationY, pAccelerationZ, pRotateDirectionX, pRotateDirectionY, pRotateDirectionZ, pRotationX, pRotationY, pRotationZ, pixels, pmouseX, pmouseY, pwinMouseX, pwinMouseY, rotationX, rotationY, rotationZ, touches, turnAxis, width, winMouseX, winMouseY, windowHeight, windowWidth, abs, acos, alpha, ambientLight, ambientMaterial, angleMode, append, applyMatrix, arc, arrayCopy, asin, atan, atan2, background, beginContour, beginShape, bezier, bezierDetail, bezierPoint, bezierTangent, bezierVertex, blend, blendMode, blue, boolean, box, brightness, byte, camera, ceil, char, circle, clear, clearStorage, color, colorMode, concat, cone, constrain, copy, cos, createA, createAudio, createButton, createCamera, createCanvas, createCapture, createCheckbox, createColorPicker, createDiv, createElement, createFileInput, createGraphics, createImage, createImg, createInput, createNumberDict, createP, createRadio, createSelect, createShader, createSlider, createSpan, createStringDict, createVector, createVideo, createWriter, cursor, curve, curveDetail, curvePoint, curveTangent, curveTightness, curveVertex, cylinder, day, debugMode, degrees, describe, describeElement, directionalLight, displayDensity, dist, downloadFile, ellipse, ellipseMode, ellipsoid, emissiveMaterial, endContour, endShape, erase, exitPointerLock, exp, fill, filter, float, floor, fract, frameRate, frustum, fullscreen, get, getFrameRate, getItem, getURL, getURLParams, getURLPath, green, gridOutput, hex, hour, httpDo, httpGet, httpPost, hue, image, imageMode, int, isLooping, join, keyIsDown, lerp, lerpColor, lightFalloff, lightness, lights, line, loadBytes, loadFont, loadImage, loadJSON, loadModel, loadPixels, loadShader, loadStrings, loadTable, loadXML, log, loop, mag, map, match, matchAll, max, millis, min, minute, model, month, nf, nfc, nfp, nfs, noCanvas, noCursor, noDebugMode, noErase, noFill, noLights, noLoop, noSmooth, noStroke, noTint, noise, noiseDetail, noiseSeed, norm, normalMaterial, orbitControl, ortho, perspective, pixelDensity, plane, point, pointLight, pop, popMatrix, popStyle, pow, print, push, pushMatrix, pushStyle, quad, quadraticVertex, radians, random, randomGaussian, randomSeed, rect, rectMode, red, redraw, registerPromisePreload, removeElements, removeItem, requestPointerLock, resetMatrix, resetShader, resizeCanvas, reverse, rotate, rotateX, rotateY, rotateZ, round, saturation, save, saveCanvas, saveFrames, saveGif, saveJSON, saveJSONArray, saveJSONObject, saveStrings, saveTable, scale, second, select, selectAll, set, setAttributes, setCamera, setFrameRate, setMoveThreshold, setShakeThreshold, shader, shearX, shearY, shininess, shorten, shuffle, sin, smooth, sort, specularColor, specularMaterial, sphere, splice, split, splitTokens, spotLight, sq, sqrt, square, storeItem, str, stroke, strokeCap, strokeJoin, strokeWeight, subset, tan, text, textAlign, textAscent, textDescent, textFont, textLeading, textOutput, textSize, textStyle, textWidth, texture, textureMode, textureWrap, tint, torus, translate, triangle, trim, unchar, unhex, updatePixels, vertex, writeFile, year */