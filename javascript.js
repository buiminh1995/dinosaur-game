//CANVAS
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 600;
CANVAS_HEIGHT = canvas.height = 253;

//only when Google font is loaded then we startGame
const FONT_NAME = 'Press Start 2P';
document.fonts.load('10px "Press Start 2P"').then(startGame);

//template contains audio
var template = document.querySelector('#audio-resources');

// Clone above template
var all_audio = template.content.cloneNode(true);
// for()

// if true show instructions
var showI = true;

// if true show Game Over images and reset button
var gameOver = false;

//cactus increase moveSpeed
var cactusSpeedIncrease = 0;
var scoreIncrease = 0.2; //0.2
var dinoScoreIncCounter = 0; //if reach 100, cactus' and score's speed increases

//game over and reset image
const gameOverImg = new Image();
const reset = new Image();
gameOverImg.src = './Other/GameOver.png';
reset.src = './Other/Reset.png';

//track that dino runs on
const trackImg1 = new Image();
const trackImg2 = new Image();
trackImg1.src = './Other/Track.png';
trackImg2.src = './Other/Track.png';
// this is to make track run with cactus
let x1TrackImg = 0;
let x2TrackImg = 2404;
let trackSpeed = 5; //equal to moveSpeed variable of Cactus()

//IMAGES FOR DINO ACTIONS
var dinoImg = new Object();
//Declare new Image objects for dino
dinoImg.dinoDead = new Image();
dinoImg.dinoDuck1 = new Image();
dinoImg.dinoDuck2 = new Image();
dinoImg.dinoJump = new Image();
dinoImg.dinoRun1 = new Image();
dinoImg.dinoRun2 = new Image();
dinoImg.dinoStart = new Image();
//Source for Image objects
dinoImg.dinoDead.src = './Dino/DinoDead.png';
dinoImg.dinoDuck1.src = './Dino/DinoDuck1.png';
dinoImg.dinoDuck2.src = './Dino/DinoDuck2.png';
dinoImg.dinoJump.src = dinoImg.dinoStart.src = './Dino/DinoJump.png';
dinoImg.dinoRun1.src = './Dino/DinoRun1.png';
dinoImg.dinoRun2.src = './Dino/DinoRun2.png';

//IMAGES FOR PTEROSAURS
var pterosaursImg = new Object();
//Declare new Image objects for pterosaurus
pterosaursImg.bird1 = new Image();
pterosaursImg.bird2 = new Image();
//Source for Image objects
pterosaursImg.bird1.src = './Bird/Bird1.png';
pterosaursImg.bird2.src = './Bird/Bird2.png';

//IMAGES FOR CACTUS
var cactusImg = new Array();
//Declare new Image objects for dino
cactusImg[0] = new Image();
cactusImg[1] = new Image();
cactusImg[2] = new Image();
cactusImg[3] = new Image();
cactusImg[4] = new Image();
cactusImg[5] = new Image();
//Source for Image objects
cactusImg[0].src = './Cactus/LargeCactus1.png'
cactusImg[1].src = './Cactus/LargeCactus2.png'
cactusImg[2].src = './Cactus/LargeCactus3.png'
cactusImg[3].src = './Cactus/SmallCactus1.png'
cactusImg[4].src = './Cactus/SmallCactus2.png'
cactusImg[5].src = './Cactus/SmallCactus3.png'

// SIMPLE KEYBOARD HANDLER
const keyboard = (() => {
  document.addEventListener("keydown", keyHandler);
  document.addEventListener("keyup", keyHandler);
  const keyboard = {
    right: false,
    left: false,
    up: false,
    down: false,
    space: false,
    any : false, // don't understand what this for
  };
  function keyHandler(e) {
    const state = e.type === "keydown" //if e.type is keydown then state == true
    if (e.keyCode == 39) {
      keyboard.right = state;
    } else if (e.keyCode == 37) {
      keyboard.left = state;
    } else if (e.keyCode == 38) {
      keyboard.up = state;
      e.preventDefault();
    } else if (e.keyCode == 40) {
      keyboard.down = state;
      e.preventDefault();
    } else if(e.keyCode == 32){
      keyboard.space = state;
    }
    if(state) { keyboard.any = true } // must reset when used
  }
  return keyboard;
})();

// define WORLD
const world = {
  gravity: 0.3, // strength per frame of gravity //prev 0.3  0.2
  drag: 0.999, // play with this value to change drag
  groundDrag: 0.9, // play with this value to change ground movement
  ground: 240,
}

var dinoScore = {
  x: 540, //520
  y: 20,
  score: 0,
  hiScore: 0,
}

//CLASS DINO
class Dino {
  constructor(){
    this.x = 10 ;
    this.y = 193;
    this.prevY = 193;
    this.dx = 0; // delta x and y
    this.dy = 0;
    this.width = 44;
    this.height = 47;
    this.onGround = false;
    this.jumpPower = -7.5;  // power of jump smaller jumps higher eg -10 smaller than -5
    //this.fallSpeed = 5;
    this.collided = false;
    this.state = "start";
    this.handleLeg = {
      legIncrement: 0,
      currentLeg: 1,
    }
    this.blood = {
      x: 10,
      y: 10,
      Width: 50,
      Height: 10,
    }
  }

  draw(){
    if(this.state == "start" || !this.onGround){
      ctx.drawImage(dinoImg.dinoStart, 0, 0, 88, 94, this.x, this.y, 44, 47);
    }
    if(this.onGround){
      if(this.handleLeg.currentLeg == 1){
        if(keyboard.down == true){
          this.y = 240 - dinoImg.dinoDuck1.naturalHeight/2;
          this.width = dinoImg.dinoDuck1.naturalWidth/2;
          this.height = dinoImg.dinoDuck1.naturalHeight/2;
          ctx.drawImage(dinoImg.dinoDuck1, 0, 0, dinoImg.dinoDuck1.naturalWidth, dinoImg.dinoDuck1.naturalHeight, this.x, 240 - dinoImg.dinoDuck1.naturalHeight/2, dinoImg.dinoDuck1.naturalWidth/2, dinoImg.dinoDuck1.naturalHeight/2);
        } else {
          this.y = 240 - dinoImg.dinoRun1.naturalHeight/2;
          this.width = dinoImg.dinoRun1.naturalWidth/2;
          this.height = dinoImg.dinoRun1.naturalHeight/2;
          ctx.drawImage(dinoImg.dinoRun1, 0, 0, dinoImg.dinoRun1.naturalWidth, dinoImg.dinoRun1.naturalHeight, this.x + 0.24, 240 - dinoImg.dinoRun1.naturalHeight/2, dinoImg.dinoRun1.naturalWidth/2, dinoImg.dinoRun1.naturalHeight/2);
        }
      } else if(this.handleLeg.currentLeg == 2){
        if(keyboard.down == true){
          this.y = 240 - dinoImg.dinoDuck2.naturalHeight/2;
          this.width = dinoImg.dinoDuck2.naturalWidth/2;
          this.height = dinoImg.dinoDuck2.naturalHeight/2;
          ctx.drawImage(dinoImg.dinoDuck2, 0, 0, dinoImg.dinoDuck2.naturalWidth, dinoImg.dinoDuck2.naturalHeight, this.x + 1, 240 - dinoImg.dinoDuck2.naturalHeight/2, dinoImg.dinoDuck2.naturalWidth/2, dinoImg.dinoDuck2.naturalHeight/2);
        } else {
          this.y = 240 - dinoImg.dinoRun2.naturalHeight/2;
          this.width = dinoImg.dinoRun2.naturalWidth/2;
          this.height = dinoImg.dinoRun2.naturalHeight/2;
          ctx.drawImage(dinoImg.dinoRun2, 0, 0, dinoImg.dinoRun2.naturalWidth, dinoImg.dinoRun2.naturalHeight, this.x, 240 - dinoImg.dinoRun2.naturalHeight/2, dinoImg.dinoRun2.naturalWidth/2, dinoImg.dinoRun2.naturalHeight/2);
        }
      }
    }
    //draw blood of dino
    ctx.beginPath();
    ctx.fillStyle = "#535353";
    ctx.rect(this.blood.x, this.blood.y , this.blood.Width, this.blood.Height);
    ctx.fill();
  }

  update(){
    this.prevY = this.y;
    if ((keyboard.space || keyboard.up) && this.onGround) {
      this.dy = this.jumpPower;
      let src = all_audio.getElementById('offline-sound-press').src;
      let audio = new Audio();
      audio.src = src;
      audio.play();
    }
    //Deal with dino blood
    if(this.collided){
      this.blood.Width -= 2;
      this.collided = false;

      if(this.blood.Width == 0){
        gameOver = true;
      }

    }
    //
    if(keyboard.down){
      this.dy += 3;
    }
    //effects of gravity
    this.dy += world.gravity;
    //
    this.y += this.dy
    //if dino is falling then increase speed of falling
    if(this.prevY < this.y){
      this.dy += 0.5;
    }
    //
    if (this.y + this.height >= world.ground) {
      this.y = world.ground - this.height;
      this.dy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
    //console.log(this.prevY,this.y);
}

  handleLegMovement(){
    if(this.handleLeg.currentLeg == 1) {
      this.handleLeg.legIncrement++;
    }
    if(this.handleLeg.currentLeg == 2) {
      this.handleLeg.legIncrement--;
    }
    if(this.handleLeg.legIncrement == 10) {
      this.handleLeg.currentLeg = 2;
      this.handleLeg.legIncrement = 0;
    }
    if(this.handleLeg.legIncrement == -10) {
      this.handleLeg.currentLeg = 1;
      this.handleLeg.legIncrement = 0;
    }
  }
}

class Pterosaurs {
  constructor(){
    this.x = CANVAS_WIDTH;
    this.y = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
    this.dx = 0; // delta x
    this.moveSpeed = -5;
    this.width = 20;
    this.height = 60;
    this.alreadyCollided = false;
    this.handleWing = {
      wingIncrement: 0,
      currentWing: 1,
    }
  }

  draw(){
      if(this.handleWing.currentWing == 1){
          this.width = pterosaursImg.bird1.naturalWidth/2;
          this.height = pterosaursImg.bird1.naturalHeight/2;
          ctx.drawImage(pterosaursImg.bird1, 0, 0, pterosaursImg.bird1.naturalWidth, pterosaursImg.bird1.naturalHeight, this.x, this.y, pterosaursImg.bird1.naturalWidth/2, pterosaursImg.bird1.naturalHeight/2);
      } else {
          this.width = pterosaursImg.bird2.naturalWidth/2;
          this.height = pterosaursImg.bird2.naturalHeight/2;
          ctx.drawImage(pterosaursImg.bird2, 0, 0, pterosaursImg.bird2.naturalWidth, pterosaursImg.bird2.naturalHeight, this.x, this.y, pterosaursImg.bird2.naturalWidth/2, pterosaursImg.bird2.naturalHeight/2);
      }
    }

  update(){
    this.dx = this.moveSpeed
    this.dx *= world.drag; // not necessary
    this.x += this.dx;
}

  handleWingMovement(){
    if(this.handleWing.currentWing == 1) {
      this.handleWing.wingIncrement++;
    }
    if(this.handleWing.currentWing == 2) {
      this.handleWing.wingIncrement--;
    }
    if(this.handleWing.wingIncrement == 10) {
      this.handleWing.currentWing = 2;
      this.handleWing.wingIncrement = 0;
    }
    if(this.handleWing.wingIncrement == -10) {
      this.handleWing.currentWing = 1;
      this.handleWing.wingIncrement = 0;
    }
  }
}
//////////
/////////Cactus class
class Cactus {
  constructor(){
    this.imgObj = cactusImg[Math.floor(Math.random() * 6)];
    this.x = CANVAS_WIDTH ;
    this.y = 240 - this.imgObj.naturalHeight/2;
    this.dx = 0; // delta x
    this.moveSpeed = -5; //-5
    this.width = this.imgObj.naturalWidth/2;
    this.height = this.imgObj.naturalHeight/2;
    this.alreadyCollided = false;
  }

  draw(){
    ctx.drawImage(this.imgObj, 0, 0, this.imgObj.naturalWidth, this.imgObj.naturalHeight, this.x, this.y, this.imgObj.naturalWidth/2, this.imgObj.naturalHeight/2);
  }

  update(){
    this.dx = this.moveSpeed
    this.dx *= world.drag;
    this.x += this.dx;
  }
}

class Cloud {
  constructor(){
    this.imgObj = new Image();
    this.imgObj.src = './Other/Cloud.png'
    this.x = CANVAS_WIDTH ;
    this.y = Math.floor(Math.random()*(100 - 5 + 1)) + 5;
  }
  draw(){
    ctx.drawImage(this.imgObj, 0, 0, this.imgObj.naturalWidth, this.imgObj.naturalHeight, this.x, this.y, this.imgObj.naturalWidth/2, this.imgObj.naturalHeight/2);
  }

  update(){
    this.x -= 2;
  }
}

/////END OF ALL CLASSES

//FUNCTIONS FOR GAME MECHANICS
async function startGame(){
  ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT); // clear the 'Click SPACE to start' line with the annoying default font
  if(keyboard.space || keyboard.up){ // don't understand this line
    keyboard.any = false;
    showI = false;
  }
  ctx.font = `24px '${FONT_NAME}'`;
  ctx.textAlign = "center";
  // ctx.fillStyle = "#000";
  await ctx.fillText("Click SPACE to start", ctx.canvas.width / 2, 80); //still the same with 'await' or not
  dino.draw();
  drawStaticStuff();
  ctx.drawImage(trackImg1,x1TrackImg, 220);
}

function gameOverMsg(){
  // ctx.fillStyle = 'black';
  // ctx.font = '60px Arial';
  // ctx.fillText('Game Over', 0,0);
  ctx.drawImage(gameOverImg, 107, 50, 386, 40);
  ctx.drawImage(reset, 262, 100, 75, 101);
}

///FUNCTIONS FOR DRAWING STUFF ON SCREEN
function drawTrack(){
  ctx.drawImage(trackImg1,x1TrackImg, 220);
  ctx.drawImage(trackImg2,x2TrackImg, 220);
  if(x1TrackImg < -2404) {x1TrackImg = 2404 - trackSpeed;}
  else {x1TrackImg -= trackSpeed;}
  if(x2TrackImg < -2404){x2TrackImg = 2404 - trackSpeed;}
  else{x2TrackImg -= trackSpeed;}
}

function drawClouds(){
  for(let i = 0; i < cloudArr.length; i++){
    cloudArr[i].update();
    cloudArr[i].draw();
  }
}

function drawStaticStuff(){
  // draw border of blood
  ctx.beginPath();
  ctx.fillStyle = "#000000";
  ctx.rect(10, 10 , 50, 10.8); //10 10 50 10.5
  ctx.stroke();
  //
}

function printScore(){
   if(window.localStorage.getItem('highScore') === null || parseInt(window.localStorage.getItem('highScore')) < dinoScore.score){
         window.localStorage.setItem('highScore', `${Math.floor(dinoScore.score)}`);
   }
   //dino score
   ctx.font = `15px '${FONT_NAME}'`;
   ctx.fillStyle = "#535353";
   ctx.fillText(`${Math.floor(dinoScore.score)}`, dinoScore.x, dinoScore.y);
   ////

   //high score
   let lenScore = Math.floor(dinoScore.score).toString().length;
   //let lenHiScore = window.localStorage.getItem('highScore').length ? window.localStorage.getItem('highScore').length : 1;
   ctx.fillStyle = "#747474";
   ctx.fillText(`HI` + " " + window.localStorage.getItem('highScore'), dinoScore.x - (90 + 7.5*lenScore), dinoScore.y);
   // ctx.fillText(`HI`, dinoScore.x - (110 + 5*lenHiScore), dinoScore.y);
   //
}
///END 'FUNCTIONS FOR DRAWING STUFF ON SCREEN'

function updateCactus_Track_Score_Speed(){
  if(dinoScoreIncCounter > 100 && cactusSpeedIncrease < 5){ // cần test lại
    cactusSpeedIncrease += 0.5; //0.4
    trackSpeed += 0.5; //0.4
    scoreIncrease += 0.16; //0.1
    dinoScoreIncCounter = 0;
    // console.log(dinoScoreIncCounter,cactusSpeedIncrease,scoreIncrease);
  }
  //console.log(cactusSpeedIncrease);
  dinoScore.score += scoreIncrease;
  dinoScoreIncCounter += scoreIncrease;
}

//GENERATE CLOUDS AND ENEMIES ON TRACK
function generateClouds(){
  if(cloudArr[0].x < -40){
    cloudArr.splice(0, 1);
  }
  //if there is no cloud in cloud array, add new one to the array
  if(cloudArr.length == 0){
    cloudArr[0] = new Cloud();
  }
  //when the last enemy in array is at 50% or less of the screen, consider adding another cloud
  if(cloudArr[cloudArr.length - 1].x < CANVAS_WIDTH*50/100){
    let new_cloud = new Cloud();
    cloudArr.push(new_cloud);
  }
}

function generateTrackEnemies(){
  //if enemy leaves the screen, delete it from enemy array
  if(trackEnemiesArray[0].x < -30){
    trackEnemiesArray.splice(0, 1);
  }
  //if there is no enemy in enemy array, add new one to the array
  if(trackEnemiesArray.length == 0){
    if(dinoScore.score > 100){
      if(Math.floor(Math.random() * 2) == 1){
        let cactus1 = new Cactus();
        cactus1.moveSpeed -= cactusSpeedIncrease;
        trackEnemiesArray.push(cactus1);
      } else {
        let peter = new Pterosaurs();
        peter.moveSpeed -= cactusSpeedIncrease;
        trackEnemiesArray.push(peter);
      }
    } else{
      let cactus1 = new Cactus();
      cactus1.moveSpeed -= cactusSpeedIncrease;
      trackEnemiesArray.push(cactus1);
    }
  }
  //when the last enemy in array is at 60% or less of the screen, consider adding another enemy
  if(trackEnemiesArray[trackEnemiesArray.length - 1].x < CANVAS_WIDTH*40/100){
      if(Math.floor(Math.random() * 38) == 2){
        if(dinoScore.score > 100){
          if(Math.floor(Math.random() * 2) == 1){
            let cactus = new Cactus();
            cactus.moveSpeed -= cactusSpeedIncrease;
            trackEnemiesArray.push(cactus);
          } else {
            let peter = new Pterosaurs();
            peter.moveSpeed -= cactusSpeedIncrease;
            trackEnemiesArray.push(peter);
          }
        } else{
          let cactus = new Cactus();
          cactus.moveSpeed -= cactusSpeedIncrease;
          trackEnemiesArray.push(cactus);
        }
      }
    }
  }
// END 'GENERATE CLOUDS AND ENEMIES ON TRACK'

//HANDLE COLLISION
function handleCollisionOnTrack(){
  for (var i = 0; i < trackEnemiesArray.length; i++) {
    if(trackEnemiesArray[i] instanceof Pterosaurs){
      trackEnemiesArray[i].handleWingMovement();
    }
    trackEnemiesArray[i].update();
    trackEnemiesArray[i].draw();
    if(dino.x + dino.width > trackEnemiesArray[i].x){
      if(dino.y <= trackEnemiesArray[i].y){
        if(dino.y + dino.height > trackEnemiesArray[i].y){
          if(trackEnemiesArray[i].alreadyCollided == false){
            dino.collided = true;
            trackEnemiesArray[i].alreadyCollided = true;
          }
        }
      } else if(dino.y > trackEnemiesArray[i].y){
        if(dino.y < trackEnemiesArray[i].y + trackEnemiesArray[i].height){
          if(trackEnemiesArray[i].alreadyCollided == false){
            dino.collided = true;
            trackEnemiesArray[i].alreadyCollided = true;
          }
        }
      }
    }
  }
}

// WHEN PRESSED RESET BUTTON TO PLAY AGAIN
canvas.addEventListener('click', function(e){
  if(gameOver){
    if(e.offsetX >= 262 && e.offsetX <= 337 && e.offsetY >= 100 && e.offsetY <= 201){
      dino = new Dino();
      cactus1 = new Cactus();
      trackEnemiesArray = [];
      trackEnemiesArray.push(cactus1);
      showI = true;
      gameOver = false;
      cactusSpeedIncrease = 0;
      scoreIncrease = 0.2;
      dinoScoreIncCounter = 0;
      trackSpeed = 5; //equal to moveSpeed of cactus
      dinoScore.x = 520,
      dinoScore.y = 20,
      dinoScore.score =  0,
      dinoScore.hiScore = 0,
      ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT); //delete Gameover and reset image
    }
  }
})

////////// Initialize DINO and CACTUS and CLOUDS
//Clouds
var cloudArr = new Array();
let new_cloud = new Cloud();
cloudArr.push(new_cloud);

//Dino
var dino = new Dino();
var cactus1 = new Cactus();
cactus1.imgObj.onload = function()
{
    cactus1.y = 240 - cactus1.imgObj.naturalHeight/2;
}
var trackEnemiesArray = [];
trackEnemiesArray.push(cactus1);

//fps-related variables
let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps){
  fpsInterval = 1000/fps;
  then = Date.now();
  startTime = then;
  animate();
}

function animate(){
  now = Date.now();
  elapsed = now - then;
  if(elapsed > fpsInterval){
    then = now - (elapsed%fpsInterval);
    if(showI){
      startGame();
    }
    if(gameOver){
       gameOverMsg();
     }
    if(!showI && !gameOver){
      ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT); //clear past animation (prev position, drawing...) of previous loop
      drawTrack();
      printScore();
      updateCactus_Track_Score_Speed();
      dino.state = "playing";
      dino.handleLegMovement();
      dino.update();
      dino.draw();
      drawStaticStuff();
      generateTrackEnemies();
      handleCollisionOnTrack();
      generateClouds();
      drawClouds();
    }
  }
  requestAnimationFrame(animate);
}
//animate();
startAnimating(60); //50
