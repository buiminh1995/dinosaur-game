const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 600;
CANVAS_HEIGHT = canvas.height = 253;

// Font for game
// let f = new FontFace('test', 'url(x)');
//
// f.load().then(function() {
//   // Ready to use the font in a canvas context
// });
const FONT_NAME = 'Press Start 2P';
document.fonts.load('10px "Press Start 2P"').then(startGame);

// Simple keyboard handler
const keyboard = (() => {
  document.addEventListener("keydown", keyHandler);
  document.addEventListener("keyup", keyHandler);
  const keyboard = {
    right: false,
    left: false,
    up: false,
    space: false,
    any : false, // don't understand what this for
  };
  function keyHandler(e) {
    const state = e.type === "keydown"
    if (e.keyCode == 39) {
      keyboard.right = state;
    } else if (e.keyCode == 37) {
      keyboard.left = state;
    } else if (e.keyCode == 38) {
      keyboard.up = state;
      e.preventDefault();
    } else if(e.keyCode == 32){
      keyboard.space = state;
    }
    if(state) { keyboard.any = true } // must reset when used
  }
  return keyboard;
})();

// define world
const world = {
  gravity: 0.3, // strength per frame of gravity //prev 0.2
  drag: 0.999, // play with this value to change drag
  groundDrag: 0.9, // play with this value to change ground movement
  ground: 240,
}

var dinoScore = {
  x: 350,
  y: 20,
  score: 0,
  hiScore: 0,
}

//////////Dinosaur class
class Dino {
  constructor(){
    this.x = 10 ;
    this.y = 180;
    this.dx = 0; // delta x and y
    this.dy = 0;
    this.onGround = false;
    this.jumpPower = -8;  // power of jump smaller jumps higher eg -10 smaller than -5
    this.moveSpeed = 2;
    this.width = 20;
    this.height = 60;
    this.collided = false;
    this.blood = {
      x: 10,
      y: 10,
      Width: 50,
      Height: 10,
    }
  }
  draw(){
    ctx.beginPath();
    ctx.rect(this.x, this.y , this.width, this.height);
    ctx.rect(this.blood.x, this.blood.y , this.blood.Width, this.blood.Height);
    ctx.fill();
  }
  update(){
    if (keyboard.space && this.onGround) { this.dy = this.jumpPower }
    if(this.collided){
      this.blood.Width -= 2;
      this.collided = false;
      if(this.blood.Width == 0){
        gameOver = true;
      }
    }
    this.dy += world.gravity;
    // this.dy *= world.drag;
    this.y += this.dy
    if (this.y + this.height >= world.ground) {
      this.y = world.ground - this.height;
      this.dy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
}
}
//////////
/////////Cactus class
class Cactus {
  constructor(){
    this.x = CANVAS_WIDTH ;
    this.y = 180;
    this.dx = 0; // delta x
    this.moveSpeed = -5;
    this.width = 20;
    this.height = 60;
    this.alreadyCollided = false;
  }
  draw(){
    ctx.beginPath();
    ctx.rect(this.x, this.y , this.width, this.height);
    ctx.stroke();
  }
  update(){
    this.dx = this.moveSpeed
    this.dx *= world.drag;
    this.x += this.dx;
  }
}


// for reset button
canvas.addEventListener('click', function(e){
  if(gameOver){
    if(e.offsetX >= 262 && e.offsetX <= 337 && e.offsetY >= 100 && e.offsetY <= 201){
      dino = new Dino();
      cactus1 = new Cactus();
      cactus2 = new Cactus();
      cactusArray = [];
      cactusArray.push(cactus1);
      cactusArray.push(cactus2);
      showI = true;
      gameOver = false;
      dinoScore.score = 0;
      cactusSpeedIncrease = 0;
      scoreIncrease = 1;
      dinoScoreIncCounter = 0;
      trackSpeed = 5;
      ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT); //delete Gameover and reset image
    }
  }
})

async function startGame(){
  ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT); // clear the 'Click SPACE to start' line with the annoying default font
  if(keyboard.any){ // don't understand this line
    keyboard.any = false;
    showI = false;
  }
  ctx.font = `24px '${FONT_NAME}'`;
  ctx.textAlign = "center";
  // ctx.fillStyle = "#000";
  await ctx.fillText("Click SPACE to start", ctx.canvas.width / 2, 80); //still the same with 'await' or not
  dino.draw();
  ctx.drawImage(trackImg1,x1TrackImg, 220);
}

function gameOverMsg(){
  // ctx.fillStyle = 'black';
  // ctx.font = '60px Arial';
  // ctx.fillText('Game Over', 0,0);
  ctx.drawImage(gameOverImg, 107, 50, 386, 40);
  ctx.drawImage(reset, 262, 100, 75, 101);
}

function drawTrack(){
  ctx.drawImage(trackImg1,x1TrackImg, 220);
  ctx.drawImage(trackImg2,x2TrackImg, 220);
  if(x1TrackImg < -2404) {x1TrackImg = 2404 - trackSpeed;}
  else {x1TrackImg -= trackSpeed;}
  if(x2TrackImg < -2404){x2TrackImg = 2404 - trackSpeed;}
  else{x2TrackImg -= trackSpeed;}
}

// function printScore(){
//   ctx.font = `15px '${FONT_NAME}'`;
//   ctx.fillText(`HI`, dinoScore.x, dinoScore.y);
//   if(window.localStorage.getItem('highScore') === null || parseInt(window.localStorage.getItem('highScore')) < dinoScore.score){
//     window.localStorage.setItem('highScore', `${Math.floor(dinoScore.score)}`);
//   }
//   ctx.fillText(window.localStorage.getItem('highScore'), dinoScore.x + 50, dinoScore.y);
//   ctx.fillText(`${Math.floor(dinoScore.score)}`, dinoScore.x + 100, dinoScore.y);
// }

function updateCactusSpeed(){
  if(dinoScoreIncCounter > 500 && cactusSpeedIncrease < 5){ // cần test lại
    cactusSpeedIncrease += 0.25; //0.2
    trackSpeed += 0.25; //0.2
    scoreIncrease += 0.15; //0.1
    dinoScoreIncCounter = 0;
    // console.log(dinoScoreIncCounter,cactusSpeedIncrease,scoreIncrease);
  }
  //console.log(cactusSpeedIncrease);
  dinoScore.score += scoreIncrease;
  dinoScoreIncCounter += scoreIncrease;
}
////////// Initialize dino and cactus
var dino = new Dino();
var cactus1 = new Cactus();
var cactus2 = new Cactus();
var cactusArray = [];
cactusArray.push(cactus1);
cactusArray.push(cactus2);

// show instruction
var showI = true;
//game state
var gameOver = false;
//cactus increase moveSpeed
var cactusSpeedIncrease = 0;
var scoreIncrease = 0.2;
var dinoScoreIncCounter = 0;


//game over and reset image
const gameOverImg = new Image();
const reset = new Image();
gameOverImg.src = './Other/GameOver.png';
reset.src = './Other/Reset.png';

//track aka background
const trackImg1 = new Image();
const trackImg2 = new Image();
trackImg1.src = './Other/Track.png';
trackImg2.src = './Other/Track.png';
let x1TrackImg = 0;
let x2TrackImg = 2404;
let trackSpeed = 5;


function animate(){
  if(showI){
    startGame();
  }
  if(gameOver){
     gameOverMsg();
   }
  if(!showI && !gameOver){
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT); //clear past animation (prev position, drawing...) of previous loop
    drawTrack();
    ctx.font = `15px '${FONT_NAME}'`;
     ctx.fillText(`HI`, dinoScore.x, dinoScore.y);
     ctx.fillText(window.localStorage.getItem('highScore'), dinoScore.x + 100, dinoScore.y);
     ctx.fillText(`${Math.floor(dinoScore.score)}`, dinoScore.x + 180, dinoScore.y);
    updateCactusSpeed();
    dino.update();
    dino.draw();
    if(cactusArray[0].x < -20){
      cactusArray.splice(0, 1);
    }
    if(cactusArray.length == 0){
      let cactus1 = new Cactus();
      cactus1.moveSpeed -= cactusSpeedIncrease;
      cactusArray.push(cactus1);
    }
    if(cactusArray[cactusArray.length - 1].x < CANVAS_WIDTH*60/100){
        if(Math.floor(Math.random() * 38) == 2){
          let cactus = new Cactus();
          cactus.moveSpeed -= cactusSpeedIncrease;
          cactusArray.push(cactus);
      }
    }
    for (var i = 0; i < cactusArray.length; i++) {
      cactusArray[i].update();
      cactusArray[i].draw();
      if(dino.x + dino.width > cactusArray[i].x && dino.y + dino.height > cactusArray[i].y){
        if(cactusArray[i].alreadyCollided == false){
          dino.collided = true;
          cactusArray[i].alreadyCollided = true;
        }
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();
