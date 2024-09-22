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

let forestFireSound; // Declare a variable for the sound
let soundStarted = false; // Track if the sound has started (default is off)
let invincible = false; // Track if the player is invincible
let fireAni;
let antagonistGroup;
let antagonistSpawnCycle = [80,60,50,30];  //in frames; the number of frames between antagonist spawning
let antagonistSpawnHeight = [-50,200,300];  // the fire will spawn at these heights alternately
let antagonistSpawnIndex = 0;  // index into the spawnHeights
let spawnIntervalFactor = Math.floor(game_end_x / antagonistSpawnCycle.length);
let antagonistLife = 500; // in frames

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

  world.gravity.y = 5; // Reduced from 7
	
  sprite = createSprite(100, 200,30);
  ground = createSprite(500,400,50000,10,'static');
  // ground.friction = 0;
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
  // spawnAntagonist(100,100,2);
  // spawnAntagonist(110,110)

  //setup collision with the antagonist
  sprite.collides(antagonistGroup, antagonistCollision);

  helicopter = createSprite(3800, 100, 60, 30);
  helicopter.shapeColor = color(0, 255, 0);
  helicopter.speed = 0;
  helicopter.rotationLock = true;

  forestFireSound.setLoop(true);
  soundStarted = false; // Initialize as not started, but we'll change this soon
}

function antagonistCollision(player, fire) {
  let spriteBottom = player.position.y + player.height/2;
  let antagonistTop = fire.position.y - fire.height/2;
  // console.log("sprite y = ",spriteBottom, "fire top=", antagonistTop);
  if (spriteBottom <= antagonistTop + 10) {  // Allow for a small overlap
    fire.remove();
  } else {
    gameOver("You didn't make it!!");
  }

}

function spawnAntagonist() {

  // adjust the spawn rate as the 
  // 4000 is the approx x location of the helicopter
  

  let xRegion = floor(sprite.x / spawnIntervalFactor);
  xRegion = constrain(xRegion,0,antagonistSpawnCycle.length);

  if(frameCount % antagonistSpawnCycle[xRegion] == 0) {
    let motion = random([-2,-1.5,-1.0,-0.5,0.5,1.0,1.5,2.0]); 
    let _x = sprite.x + 400; 
    let _y = antagonistSpawnHeight[antagonistSpawnIndex % antagonistSpawnHeight.length];

    let a = new antagonistGroup.Sprite(_x,_y);

    a.speed = Math.sign(motion) * 2; //random(-3,-3);
    a.direction = 180;
    a.scale.x = 0.5;
    a.scale.y = 0.5;
    // set the x update value for this antagonit
    a.motion = motion;
    a.update = () => {
      a.x -= a.motion;
    }

    antagonistSpawnIndex++;
  }
}

function createAntagonists() {//creates antagonists Group
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
  
  
  // let temp = platformOn();
  // if(temp != -1) {
  //   print(temp);
  // }

  // Calculate the height to maintain aspect ratio
  let backdropWidth = 7046; // Use the actual width of your image
  let backdropHeight = (backdropWidth / 7046) * 720; // Maintain original aspect ratio

  // Draw the backdrop image tiled
  let startX = -camera.position.x % backdropWidth;
  for (let x = startX; x < width; x += backdropWidth) {
    image(backdrop, x, 0, backdropWidth, backdropHeight);
  }

  screenX = sprite.position.x + 200;
    
  // camera.position.x = sprite.position.x;
  // camera.moveTo(sprite.position.x, 540);

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

  spawnAntagonist();

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
  camera.position.x = sprite.position.x;
  camera.moveTo(sprite.position.x, 540);
  displayFPS();
}

function displayFPS() {
  push();
  textAlign(LEFT, TOP);
  textSize(16);
  fill(255); // Change to white for better visibility
  stroke(0); // Add black outline
  strokeWeight(2);
  text(`FPS: ${fps}`, camera.position.x - width/2 + 10, camera.position.y - height/2 + 30);
  pop();
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
  
  // Create a refresh button
  let refreshButton = createButton('Refresh Game');
  refreshButton.position(width / 2 - 60, height / 2 + 40); // Position the button below the message
  refreshButton.mousePressed(refreshGame); // Set the button's action
}

function refreshGame() {
  location.reload(); // Refresh the page to restart the game
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

/* globals ADD, ALT, ARROW, AUDIO, AUTO, AXES, BACKSPACE, BASELINE, BEVEL, BEZIER, BLEND, BLUR, BOLD, BOLDITALIC, BOTTOM, BURN, CENTER, CHORD, CLAMP, CLOSE, CONTROL, CORNER, CORNERS, CROSS, CURVE, DARKEST, DEGREES, DEG_TO_RAD, DELETE, DIFFERENCE, DILATE, DODGE, DOWN_ARROW, ENTER, ERODE, ESCAPE, EXCLUSION, FALLBACK, FILL, GRAY, GRID, HALF_PI, HAND, HARD_LIGHT, HSB, HSL, IMAGE, IMMEDIATE, INVERT, ITALIC, LABEL, LANDSCAPE, LEFT, LEFT_ARROW, LIGHTEST, LINEAR, LINES, LINE_LOOP, LINE_STRIP, MIRROR, MITER, MOVE, MULTIPLY, NEAREST, NORMAL, OPAQUE, OPEN, OPTION, OVERLAY, P2D, PI, PIE, POINTS, PORTRAIT, POSTERIZE, PROJECT, QUADRATIC, QUADS, QUAD_STRIP, QUARTER_PI, RADIANS, RADIUS, RAD_TO_DEG, REMOVE, REPEAT, REPLACE, RETURN, RGB, RIGHT, RIGHT_ARROW, ROUND, SCREEN, SHIFT, SOFT_LIGHT, SQUARE, STROKE, SUBTRACT, TAB, TAU, TESS, TEXT, TEXTURE, THRESHOLD, TOP, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, TWO_PI, UP_ARROW, VIDEO, WAIT, WEBGL, accelerationX, accelerationY, accelerationZ, deltaTime, deviceOrientation, displayHeight, displayWidth, focused, frameCount, height, isKeyPressed, key, keyCode, keyIsPressed, mouseButton, mouseIsPressed, mouseX, mouseY, movedX, movedY, pAccelerationX, pAccelerationY, pAccelerationZ, pRotateDirectionX, pRotateDirectionY, pRotateDirectionZ, pRotationX, pRotationY, pRotationZ, pixels, pmouseX, pmouseY, pwinMouseX, pwinMouseY, rotationX, rotationY, rotationZ, touches, turnAxis, width, winMouseX, winMouseY, windowHeight, windowWidth, abs, acos, alpha, ambientLight, ambientMaterial, angleMode, append, applyMatrix, arc, arrayCopy, asin, atan, atan2, background, beginContour, beginShape, bezier, bezierDetail, bezierPoint, bezierTangent, bezierVertex, blend, blendMode, blue, boolean, box, brightness, byte, camera, ceil, char, circle, clear, clearStorage, color, colorMode, concat, cone, constrain, copy, cos, createA, createAudio, createButton, createCamera, createCanvas, createCapture, createCheckbox, createColorPicker, createDiv, createElement, createFileInput, createGraphics, createImage, createImg, createInput, createNumberDict, createP, createRadio, createSelect, createShader, createSlider, createSpan, createStringDict, createVector, createVideo, createWriter, cursor, curve, curveDetail, curvePoint, curveTangent, curveTightness, curveVertex, cylinder, day, debugMode, degrees, describe, describeElement, directionalLight, displayDensity, dist, downloadFile, ellipse, ellipseMode, ellipsoid, emissiveMaterial, endContour, endShape, erase, exitPointerLock, exp, fill, filter, float, floor, fract, frameRate, frustum, fullscreen, get, getFrameRate, getItem, getURL, getURLParams, getURLPath, green, gridOutput, hex, hour, httpDo, httpGet, httpPost, hue, image, imageMode, int, isLooping, join, keyIsDown, lerp, lerpColor, lightFalloff, lightness, lights, line, loadBytes, loadFont, loadImage, loadJSON, loadModel, loadPixels, loadShader, loadStrings, loadTable, loadXML, log, loop, mag, map, match, matchAll, max, millis, min, minute, model, month, nf, nfc, nfp, nfs, noCanvas, noCursor, noDebugMode, noErase, noFill, noLights, noLoop, noSmooth, noStroke, noTint, noise, noiseDetail, noiseSeed, norm, normalMaterial, orbitControl, ortho, perspective, pixelDensity, plane, point, pointLight, pop, popMatrix, popStyle, pow, print, push, pushMatrix, pushStyle, quad, quadraticVertex, radians, random, randomGaussian, randomSeed, rect, rectMode, red, redraw, registerPromisePreload, removeElements, removeItem, requestPointerLock, resetMatrix, resetShader, resizeCanvas, reverse, rotate, rotateX, rotateY, rotateZ, round, saturation, save, saveCanvas, saveFrames, saveGif, saveJSON, saveJSONArray, saveJSONObject, saveStrings, saveTable, scale, second, select, selectAll, set, setAttributes, setCamera, setFrameRate, setMoveThreshold, setShakeThreshold, shader, shearX, shearY, shininess, shorten, shuffle, sin, smooth, sort, specularColor, specularMaterial, sphere, splice, split, splitTokens, spotLight, sq, sqrt, square, storeItem, str, stroke, strokeCap, strokeJoin, strokeWeight, subset, tan, text, textAlign, textAscent, textDescent, textFont, textLeading, textOutput, textSize, textStyle, textWidth, texture, textureMode, textureWrap, tint, torus, translate, triangle, trim, unchar, unhex, updatePixels, vertex, writeFile, year */