function GameSolver() {
  this.isPaused = false;
  this.interval;
  this.time = 0;
  // TODO : inputbuffer

  this.loop = () => {
    if(this.isPaused) return;
    // game logic here
    this.time++;
    requestAnimationFrame(this.draw);
  };

  this.draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "red";
    ctx.fillRect(this.time, 100, 100, 100);
  };

  this.startInterval = () => {this.interval = setInterval(this.loop, TICKPERSECOND)};
  this.pauseInterval = () => {this.isPaused = true};
  this.continueInterval = () => {this.isPaused = false};
  this.clearInterval = () => {clearInterval(this.interval)};
}

// Player:
//   - camera
//   - playerentity

function Object(x, y, w, h, sprite_path) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.sprite = new Image();
  this.sprite.src = sprite_path;
  this.colliders = [];
}

function Box(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

function Circle(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
}


// Level:
// - vars:
//   - title
//   - tilemap
//   - rendermap
// - functions :
//   - generate rendermap
//   - changetileat(x, y)