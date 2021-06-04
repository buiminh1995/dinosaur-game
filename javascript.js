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

//Dinosaur
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
      bloodContainerX: 10,
      bloodContainerY: 10,
      bloodContainerWidth: 50,
      bloodContainerHeight: 10,
    }
  }
  draw(){
    ctx.beginPath();
    //ctx.rect(this.blood.X, this.blood.Y , this.blood.bloodWidth, this.blood.bloodHeight);
    ctx.rect(this.x, this.y , this.width, this.height);
    ctx.rect(this.blood.bloodContainerX, this.blood.bloodContainerY , this.blood.bloodContainerWidth, this.blood.bloodContainerHeight);
    ctx.fill();
  }
  update(){
    if (keyboard.space && this.onGround) { this.dy = this.jumpPower }
    if(this.collided){
      this.blood.bloodContainerWidth -= 2;
      this.collided = false;
      if(this.blood.bloodContainerWidth == 0){
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
    this.dx = this.moveSpeed
    this.dx *= world.drag;
    this.x += this.dx;
  }
}

const dino = new Dino();
const cactus1 = new Cactus();
const cactus2 = new Cactus();
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
// when click on reset button to restart game
// reset.addEventListener('click', function(e){
//   startGame();
//   animate();
// });

// function handleGameStatus(){
//   if(showI){
//     if(keyboard.any){ // don't understand this line
//       keyboard.any = false;
//       showI = false;
//     }
//     ctx.textAlign = "center";
//     ctx.font = "24px arial";
//     ctx.fillStyle = "#000";
//     ctx.fillText("Click SPACE to start", ctx.canvas.width / 2, 80);
//     dino.draw();
//   }
//   if(gameOver){
//     ctx.fillStyle = 'black';
//     ctx.font = '60px Arial';
//     ctx.fillText('Game Over', 0,0);
//     // ctx.drawImage(gameOverImg, 107, 50, 386, 40);
//     // ctx.drawImage(reset, 262, 100, 75, 101);
//   }
// }
function animate(){
  if(showI){
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
  if(gameOver){
     // ctx.fillStyle = 'black';
     // ctx.font = '60px Arial';
     // ctx.fillText('Game Over', 0,0);
     ctx.drawImage(gameOverImg, 107, 50, 386, 40);
     ctx.drawImage(reset, 262, 100, 75, 101);
   }
  else{
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
