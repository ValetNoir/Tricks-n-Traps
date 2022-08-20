function GameSolver(controls) {
  this.isPaused = false;
  this.interval;
  this.time = 0;

  this.speed = 5;
  this.maxSpeed = 10;
  this.frictioness = this.speed;

  // state conditions
  this.isRunning = false;

  this.player = new GameObject(
    0, 0, 200, 200,
    new Sprite(
      new Spritesheet(
        "./assets/spritesheets/goblin.png",
        {
          idle: new SpriteAnimation([0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6], true),
          start_run: new SpriteAnimation([7,8], false),
          run: new SpriteAnimation([9,10,11,12,13,14,15], true),
        },
        32
      ),
      new StateMachine(
        [
          new State(
            "idle",
            [
              new Link(
                [
                  () => {return this.isRunning},
                ],
                1
              ),
            ]
          ),
          new State(
            "run",
            [
              new Link(
                [
                  () => {return !this.isRunning},
                ],
                0
              ),
            ]
          ),
        ]
      )
    ),
    []
  );

  this.vx = 0;
  this.vy = 0;
  
  this.inventory = [];
  
  this.inputHandler = {
    up : new KeyHandler(
      controls.upKey,
      () => {},
      () => { if(!this.isPaused) this.buff(() => {this.vy += -1 * this.speed;}); },
      () => {},
    ),
    left : new KeyHandler(
      controls.leftKey,
      () => {},
      () => { if(!this.isPaused) this.buff(() => {this.vx += -1 * this.speed; this.player.sprite.isLookingLeft = true;}); },
      () => {},
    ),
    down : new KeyHandler(
      controls.downKey,
      () => {},
      () => { if(!this.isPaused) this.buff(() => {this.vy += 1 * this.speed;}); },
      () => {},
    ),
    right : new KeyHandler(
      controls.rightKey,
      () => {},
      () => { if(!this.isPaused) this.buff(() => {this.vx += 1 * this.speed; this.player.sprite.isLookingLeft = false;}); },
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

  this.inputBuffer = [];
  this.buff = (callback) => {
    this.inputBuffer.push(callback);
  };

  this.changeKeys = (controls) => {
    this.inputHandler.up.setKey(controls.upKey);
    this.inputHandler.left.setKey(controls.leftKey);
    this.inputHandler.down.setKey(controls.downKey);
    this.inputHandler.right.setKey(controls.rightKey);
  }

  // this.actualLevel
  this.loop = () => {
    if(this.isPaused) return;

    while(this.inputBuffer.length > 0) {
      this.inputBuffer[0]();
      this.inputBuffer.shift();
    }

    if(this.vx < this.maxSpeed && this.vx > -this.maxSpeed && this.vy < this.maxSpeed && this.vy > -this.maxSpeed) {
      this.isRunning = false;
    } else {
      this.isRunning = true;
    }

    this.vx = Math.min(this.maxSpeed, this.vx);
    this.vx = Math.max(-this.maxSpeed, this.vx);
    this.vy = Math.min(this.maxSpeed, this.vy);
    this.vy = Math.max(-this.maxSpeed, this.vy);

    this.player.move(this.vx, this.vy);
    if(this.vx > 0) {
      this.vx -= this.frictioness; // friction
    } else if (this.vx < 0) {
      this.vx += this.frictioness;
    }
    if(this.vy > 0) {
      this.vy -= this.frictioness;
    } else if (this.vy < 0) {
      this.vy += this.frictioness;
    }

    this.vx = Math.min(this.maxSpeed, this.vx);
    this.vx = Math.max(-this.maxSpeed, this.vx);
    this.vy = Math.min(this.maxSpeed, this.vy);
    this.vy = Math.max(-this.maxSpeed, this.vy);

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

function Level(tilemap, floormap, entities) {
  // this.title;
  this.tilemap = tilemap;
  this.floormap = floormap;

  this.players = {};
  this.entities = entities;
  // chest are entities

  this.addPlayer = (player) => {
    let id = generateId();
    this.players[id] = player;
    return id;
  };

  this.rendermap;
  this.generateRendermap = () => {};

  this.changeTileAt = (x, y, newMaterial) => {
    this.tilemap[x][y] = newMaterial;
  };
}

function Controls(upKey, leftKey, downKey, rightKey) {
  this.upKey = upKey;
  this.leftKey = leftKey;
  this.downKey = downKey;
  this.rightKey = rightKey;
}

function Item() {
}

function GameObject(x, y, w, h, sprite, colliders) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.sprite = sprite;
  this.colliders = colliders;

  this.move = (x, y, toCheckCollisions) => {
    //check collisions with level.entities and level.tilemap
    let finalX = x;
    let finalY = y;

    // for(let i = 0; i < toCheckCollisions; i++) {

    // }
    
    this.x += finalX;
    this.y += finalY;
  }

  this.draw = () => {
    this.sprite.draw(this.x, this.y, this.w, this.h);
  };
}

function Sprite(spritesheet, animationStateMachine) {
  this.spritesheet = spritesheet;
  this.currentFrame;
  this.animationStateMachine = animationStateMachine;
  this.currentAnimationIndex = this.animationStateMachine.findState();
  
  this.isLookingLeft = false;

  this.draw = (x, y, w, h) => {
    if(this.isLookingLeft) {
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.spritesheet.image,
        this.currentFrame * spritesheet.u,
        0,
        this.spritesheet.u,
        this.spritesheet.image.height,
        -(x + w),
        y,
        w,
        h,
      );
      ctx.scale(-1, 1);
    } else {
      ctx.drawImage(
        this.spritesheet.image,
        this.currentFrame * spritesheet.u,
        0,
        this.spritesheet.u,
        this.spritesheet.image.height,
        x,
        y,
        w,
        h,
      );
    }
  };

  this.getCurrentAnimationIndex = () => { // define which animation to play right now
    let newIndex = this.animationStateMachine.findState();
    if(this.currentAnimationIndex != newIndex && (this.spritesheet.animations[this.currentAnimationIndex].canCancel || this.spritesheet.animations[this.currentAnimationIndex].currentFrameIndex == 0)) {
      this.spritesheet.animations[this.currentAnimationIndex].reset();
      this.currentAnimationIndex = newIndex;
    }
    return this.currentAnimationIndex;
  };

  this.playAnimation = () => {
    let i = this.getCurrentAnimationIndex();
    this.spritesheet.animations[i].step();
    this.currentFrame = this.spritesheet.animations[i].getCurrentFrame();
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

function SpriteAnimation(frames, canCancel) {
  this.frames = frames;
  this.currentFrameIndex = 0;
  this.hasStarted = false;
  this.canCancel = canCancel;

  this.reset = () => {
    this.hasStarted = false;
    this.currentFrameIndex = 0;
  }

  this.getCurrentFrame = () => {
    return this.frames[this.currentFrameIndex];
  }

  this.step = () => {
    this.currentFrameIndex++;
    if(this.currentFrameIndex == this.frames.length) {
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

function rInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// const SPRITESHEETS = {
//   goblin : new Spritesheet(
//     "./assets/spritesheets/goblin.png",
//     {
//       idle: new SpriteAnimation([0,1,2,3,4,5,6,7]),
//       start_run: new SpriteAnimation([8,9]),
//       run: new SpriteAnimation([10,11,12,13,14,15]),
//     },
//     32
//   ),
// };