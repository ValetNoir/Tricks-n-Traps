function GameSolver(controls) {
  this.isPaused = false;
  this.interval;
  this.time = 0;

  this.speed = 5;

  this.player = new GameObject(
    0, 0, 200, 200,
    new Sprite(
      "goblin",
      new StateMachine(
        [
          new State(
            0,
            [
              new Link(
                [
                  () => {return true},
                ],
                0
              )
            ]
          )
        ]
      )
    ),
    []
  );
  
  this.inventory = [];
  
  this.inputHandler = {
    up : new KeyHandler(
      controls.upKey,
      () => {},
      () => { if(!this.isPaused) this.player.move(0, -1 * this.speed); },
      () => {},
    ),
    left : new KeyHandler(
      controls.leftKey,
      () => {},
      () => { if(!this.isPaused) this.player.move(-1 * this.speed, 0); },
      () => {},
    ),
    down : new KeyHandler(
      controls.downKey,
      () => {},
      () => { if(!this.isPaused) this.player.move(0, 1 * this.speed); },
      () => {},
    ),
    right : new KeyHandler(
      controls.rightKey,
      () => {},
      () => { if(!this.isPaused) this.player.move(1 * this.speed, 0); },
      () => {},
    ),
    escape : new KeyHandler(
      "Escape",
      () => {
        this.isPaused = !this.isPaused;
      },
      () => {},
      () => {},
    ),
  }

  this.changeKeys = (controls) => {
    this.inputHandler.up.setKey(controls.upKey);
    this.inputHandler.left.setKey(controls.leftKey);
    this.inputHandler.down.setKey(controls.downKey);
    this.inputHandler.right.setKey(controls.rightKey);
  }

  // this.actualLevel

  this.loop = () => {
    if(this.isPaused) return;
    // game logic here
    // this.player.x += 1;
    this.time++;
    requestAnimationFrame(this.draw);
  };

  this.draw = () => {
    ctx.clearRect(0, 0, W, H);
    this.player.draw();
  };

  this.start = () => {this.interval = setInterval(this.loop, TICK_FRAMERATE)};
  this.pause = () => {this.isPaused = true};
  this.unpause = () => {this.isPaused = false};
  this.stop = () => {clearInterval(this.interval)};
}

function Controls(upKey, leftKey, downKey, rightKey) {
  this.upKey = upKey;
  this.leftKey = leftKey;
  this.downKey = downKey;
  this.rightKey = rightKey;
}

// function Game(levels) {
//   this.levels = levels;
// }

function Item() {
}

function GameObject(x, y, w, h, sprite, colliders) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.sprite = sprite;
  this.colliders = colliders;

  this.move = (x, y) => {
    //check collisions with level.entities and level.tilemap
    this.x += x;
    this.y += y;
  }

  this.draw = () => {
    let spritesheet = SPRITESHEETS[this.sprite.spritesheetKey];
    ctx.drawImage(
      spritesheet.image,
      this.sprite.currentFrame * spritesheet.u,
      0,
      spritesheet.u,
      spritesheet.image.height,
      this.x,
      this.y,
      this.w,
      this.h,
    );
  };
}

function Sprite(spritesheetKey, animationStateMachine) {
  this.spritesheetKey = spritesheetKey;
  this.currentFrame;
  this.animationStateMachine = animationStateMachine;

  this.currentAnimationIndex = () => { // define which animation to play right now
    return this.animationStateMachine.findState();
  };

  this.playAnimation = () => {
    let i = this.currentAnimationIndex();
    SPRITESHEETS[this.spritesheetKey].animations[i].step();
    this.currentFrame = SPRITESHEETS[this.spritesheetKey].animations[i].getCurrentFrame();
  };
  
  this.playAnimation();
  this.animationInterval = setInterval(this.playAnimation, ANIMATION_FRAMERATE);
}

function Spritesheet(src, animations, unitWidth) {
  this.image = new Image();
  this.image.src = src;
  this.animations = animations;
  this.u = unitWidth;
}

function SpriteAnimation(frames) {
  this.frames = frames;
  this.currentFrameIndex = this.frames[0];

  this.getCurrentFrame = () => {
    return this.frames[this.currentFrameIndex];
  }

  this.step = () => {
    this.currentFrameIndex++;
    if(this.currentFrameIndex >= this.frames.length) {
      this.currentFrameIndex = 0;
    }
  }
}

function StateMachine(states) {
  this.states = states; // array
  this.actualStateIndex = 0;
  this.findState = () => {
    while(true) {
      let newStateIndex = this.states[this.actualStateIndex].followLinks();
      newStateIndex = (newStateIndex == null)? this.actualStateIndex : newStateIndex;
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

const Collider = {
  // return bool Box&Box collision
  checkBoxBoxCollision : (boxA, boxB) => {
    return (
      boxA.x + boxA.w > boxB.x &&
      boxA.x < boxB.x + boxB.w &&
      boxA.y + boxA.h > boxB.y &&
      boxA.y < boxB.y + boxB.h
    );
  },

  // return bool Circle&Box collision
  checkCircleBoxCollision : (circle, box) => {
    let testX = circle.x;
    let testY = circle.y;
    // which edge is closest?
    if (circle.x < box.x)               testX = box.x;           // test left edge
    else if (circle.x > box.x + box.w)  testX = box.x + box.w;   // right edge
    if (circle.y < box.y)               testY = box.y;           // top edge
    else if (circle.y > box.y + box.h)  testY = box.y + box.h;   // bottom edge
    // distance to closest edge < radius => collision
    return Math.hypot(circle.x - testX, circle.y - testY) < circle.r;
  },

  // return bool Circle&Circle collision
  checkCircleCircleCollision : (circleA, circleB) => {
    return Math.hypot(circleA.x - circleB.x, circleA.y - circleB.y) > circleA.r + circleB.r; // dist > sum of radius of circles ?
  },
};

const SPRITESHEETS = {
  goblin : new Spritesheet(
    "./assets/spritesheets/goblin.png",
    [
      new SpriteAnimation([0,1,2,3,4,5,6,7]),
    ],
    32
  ),
};