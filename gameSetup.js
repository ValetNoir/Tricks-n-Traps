const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
var W, H;
const TICK_FRAMERATE = 1000 / 60;
const ANIMATION_FRAMERATE = 1000 / 10;

resizeCanvas();
canvas.style.backgroundColor = "#000000";
document.body.style.overflow = "hidden";
document.body.style.margin = "0";
document.body.appendChild(canvas);

function resizeCanvas() {
  canvas.width = W = window.innerWidth;
  canvas.height = H = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);

function Spritesheet(src, animations, unitWidth) {
  this.image = new Image();
  this.image.src = src;
  this.animations = animations;
  this.u = unitWidth
}

const SPRITESHEETS = {
  goblin : new Spritesheet(
    "./assets/spritesheets/goblin.png",
    [],
    32
  ),
};