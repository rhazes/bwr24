/*
the baddie class
*/
//Antagonist position 
var posX = 200;
var posY = 200; 
var pos2X = 100;
var pos2Y = 100;
function preload() {
  img = loadImage('antagonistSpriteImage');
  img2 = loadImage('mainCharacterImage')
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  image(img, posX, posY)
  image(img2, pos2X, pos2Y)
  img.resize(0, 50)
  img2.resize(0, 50)
  posX = posX + random(-3, 3)
  posY = posY + random(-3, 3)
frameRate(20);
  if(keyCode == UP_ARROW) {
    pos2Y = pos2Y - 5; 
  }
  if(keyCode == DOWN_ARROW) {
    pos2Y = pos2Y + 5; 
  }
  if(keyCode == RIGHT_ARROW) {
    pos2X = pos2X + 5; 
  }
  if(keyCode == LEFT_ARROW) {
    pos2X = pos2X - 5;
  }
  
  posX = posX + int(random(-5, 5))
  posY = posY + int(random(-5, 5))
  
  if(pos2X >= posX - 100 && pos2X <= posX + 100 && pos2Y >= posY - 100 && pos2Y <= posX + 5) {
    text("GAME OVER", windowWidth / 4, windowHeight / 4);
  }

//game end

}
