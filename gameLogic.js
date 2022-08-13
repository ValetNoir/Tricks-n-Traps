var testObject = new GameObject(
  0, 100, 50, 50,
  new Sprite()
);

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

  this.start = () => {this.interval = setInterval(this.loop, TICK_FRAMERATE)};
  this.pause = () => {this.isPaused = true};
  this.continue = () => {this.isPaused = false};
  this.stop = () => {clearInterval(this.interval)};
}

// function Game(levels) {
//   this.levels = levels;
// }

// Player:
//   - camera
//   - playerentity

function GameObject(x, y, w, h, sprite, colliders) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.sprite = sprite;
  this.colliders = colliders;

  this.draw = () => {
    let spritesheet = SPRITESHEETS[this.sprite.spritesheetKey];
    ctx.drawImage(
      spritesheet.image,
      this.sprite.currentFrame * SPRITE_SOURCE_SIZE,
      0,
      spritesheet.u,
      spritesheet.image.height,
      this.x,
      this.y,
      this.w
    );
  };
}

function Sprite(w, spritesheetKey, animations, animationStateMachine) {
  this.spritesheetKey = spritesheetKey;
  this.currentFrame;
  this.animations = animations;
  this.animationStateMachine = animationStateMachine;

  this.currentAnimationIndex = () => { // define which animation to play right now
    return this.animationStateMachine.findState();
  };

  this.playAnimation = () => {
    let i = this.currentAnimationIndex();
    this.animations[i].step();
    this.currentFrame = this.animations[i].getCurrentFrame();
  };
  
  this.playAnimation();
  this.animationInterval = setInterval(this.playAnimation, ANIMATION_FRAMERATE);
}

function Animation(frames) {
  this.frames = frames;
  this.currentFrameIndex = this.frames[0];

  this.getCurrentFrame = () => {
    return this.frames[this.currentFrameIndex];
  }

  this.step = () => {
    this.currentFrameIndex++;
  }
}

function StateMachine(states) {
  this.states = states; // array
  this.actualStateIndex = 0;
  this.findState = () => {
    while(true) {
      let newStateIndex = this.states[this.actualStateIndex].followLinks();
      if(this.actualStateIndex == newStateIndex) {
        return this.states[this.actualStateIndex].value;
      } else {
        this.actualStateIndex = newStateIndex;
      }
    }
  };
}

function State(value, links) {
  this.value = value;
  this.links = links; // array
  this.followLinks = () => {
    for(let i = 0; i < this.links.length; i++) {
      if(this.links[i].checkConditions()) {
        return this.links[i].destinationIndex;
      }
    }
  };
}

function Link(condition_functions, destinationIndex) {
  this.condition_functions = condition_functions; // array
  this.destinationIndex = destinationIndex;
  this.checkConditions = () => {
    let isGood = false;
    for(let i = 0; i < this.condition_functions.length; i++) {
      if(this.condition_functions[i]()) {
        isGood = true;
      }
    }
    return isGood;
  };
}

const Collider = {
  checkBoxBoxCollision : (boxA, boxB) => {
    // return bool Box&Box collision
  },
  checkCircleBoxCollision : (circle, box) => {
    // return bool Circle&Box collision
  },
  checkCircleCircleCollision : (circleA, circleB) => {
    // return bool Circle&Circle collision
  },
};

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
//   - entities
//   - tileentities
// - functions :
//   - generate rendermap
//   - changetileat(x, y)