const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d');

CANVAS_WIDTH = canvas.width = 600;
CANVAS_HEIGHT = canvas.height = 253;

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
  ground: 253,
}

//////////Dinosaur class
class Dino {
  constructor(){
    this.x = 3 ;
    this.y = 193;
    this.dx = 0; // delta x and y
    this.dy = 0;
    this.onGround = false;
    this.jumpPower = -7;  // power of jump smaller jumps higher eg -10 smaller than -5
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
    this.dy *= world.drag;
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
    this.y = 193;
    this.dx = 0; // delta x
    this.moveSpeed = -5;
    this.width = 20;
    this.height = 60;
  }
  draw(){
    ctx.beginPath();
    ctx.rect(this.x, this.y , this.width, this.height);
    ctx.stroke();
  }
  update(){
    console.log(this.moveSpeed);
    this.dx = this.moveSpeed
    this.dx *= world.drag;
    this.x += this.dx;
  }
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

//game over and reset image
const gameOverImg = new Image();
const reset = new Image();
gameOverImg.src = './Other/GameOver.png';
reset.src = './Other/Reset.png';

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
      ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }
})

function startGame(){
  if(keyboard.any){ // don't understand this line
    keyboard.any = false;
    showI = false;
  }
  ctx.textAlign = "center";
  ctx.font = "24px arial";
  ctx.fillStyle = "#000";
  ctx.fillText("Click SPACE to start", ctx.canvas.width / 2, 80);
  dino.draw();
}

function gameOverMsg(){
  // ctx.fillStyle = 'black';
  // ctx.font = '60px Arial';
  // ctx.fillText('Game Over', 0,0);
  ctx.drawImage(gameOverImg, 107, 50, 386, 40);
  ctx.drawImage(reset, 262, 100, 75, 101);
}

function animate(){
  if(showI){
    startGame();
  }
  if(gameOver){
     gameOverMsg();
   }
  if(!showI && !gameOver){
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    dino.update();
    dino.draw();
    if(cactusArray[0].x < -20){
      cactusArray.splice(0, 1);
    }
    if(cactusArray.length == 0){
      let cactus1 = new Cactus();
      cactusArray.push(cactus1);
    }
    if(cactusArray[cactusArray.length - 1].x < CANVAS_WIDTH*60/100){
        if(Math.floor(Math.random() * 38) == 2){
          let cactus = new Cactus();
          cactusArray.push(cactus);
        }
    }
    for (var i = 0; i < cactusArray.length; i++) {
      cactusArray[i].update();
      cactusArray[i].draw();
      if(cactusArray[i].x >= dino.x && (cactusArray[i].x - dino.x) < dino.width && (cactusArray[i].y - dino.y) < dino.width){
        dino.collided = true;
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();
