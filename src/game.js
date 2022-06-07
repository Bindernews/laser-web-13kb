import { GRID_H, GRID_SIZE, GRID_W, Direction, LASER_SPEED } from "./constants";
import { Vec2 } from "./vec2";
import { CircleShape } from "./collision";
import { Grid } from "./grid";
import { arraySwap, canvasRotateMove, isFunc, toView } from "./mutil";

class RotateShooter {
  pos = new Vec2(0, 0);
  direction = Direction.East;

  fire() {
    //fire the shooter
  }

  draw(ctx) {}
}
//let rotate = new RotateShooter();
//rotate.draw(this.ctx);
class Shooter {
  //shoots a laser when clicked
  //only shoots to the right
  constructor(center, facing) {
    const radius = GRID_SIZE / 2 - 4;
    /** @type {Vec2} */
    this.center = center;
    /** @type {Shape} */
    this.collider = new CircleShape(this.center.clone(), radius);
    this.radius = radius;
    /** @type {Direction} */
    this.facing = facing;
    /** @type {Game} */
    this.game = null;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    canvasRotateMove(ctx, this.center, (this.facing * Math.PI) / 2);
    //draw a circle - we will determine if player clicks on this
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false); //centerX, centerY, radius //25 25 10
    ctx.fill();
    //end draw circle

    //draw a line to indicate shooter direction
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 10, 2); //(x, y, width, height)

    // Restore previous transform and draw settings
    ctx.restore();
  }

  update(elapsed) {
    //do nothing
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseDown(e) {
    let c = this.center;
    if (this.game.mouseGame.inCircle(c.x, c.y, this.radius)) {
      console.log("great job u clicked on the shooter you win!!!");
      let velocity = Direction.toVec(this.facing).mul(LASER_SPEED);
      let laser = new Laser(c.clone(), velocity); //pos vec, velocity vec
      //2 ways we could do this new Vec2(c.x, c.y) OR c.clone()

      // Actually add our laser to the game
      game.addObjects(laser);
    }
  }

  //add code to detect player clicks
  //this in the bigger picture is the "game" this. pass this as a parameter, and set it to game
  mouseInShooter(game) {
    //return true if mouse is over Shooter
    let mouseinshoot = game.mouseGame.inCircle(
      this.centerX,
      this.centerY,
      this.radius
    );
    return mouseinshoot;
  }
}

class Laser {
  //moves to the right forever
  //TODO: make it start in a direction based on constructor
  //TODO: Add collision detection based on if it hits mirror
  constructor(pos, velocity) {
    //pos is (x,y) coord
    //this.pos.x and this.pos.y are the X and Y coordinates
    //velocity is (x,y) velocity
    //this.velocity.x and this.velocity.y are
    //pos (x,y) is top left corner of laser because of how fillRect works
    this.pos = pos;
    this.velocity = velocity;
    /** @type {CircleShape} */
    this.collider = new CircleShape(pos, GRID_SIZE / 4);
    /** Object that spawned this laser */
    this.spawner = null;
    /** @type {Game} */
    this.game = null;
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.pos.x, this.pos.y, 10, 2); //(x, y, width, height)
  }

  update(elapsed) {
    this.pos.add(elapsed * this.velocity.x, elapsed * this.velocity.y);
    this.collider.center = this.pos.clone();
    // Test for collisions with other objects and if found, tell those objects they've been hit
    for (const other of this.game.ggrid.getCollisions(this.collider)) {
      if (other !== this.spawner && isFunc(other.onLaserHit)) {
        other.onLaserHit(this);
      }
    }
  }
}

/**
 * @class Main game state
 */
export class Game {
  constructor() {
    // NOTE: Some names (like ggrid) are that way to help the name-mangler
    // reduce the code size.
    let canvas = document.getElementById("render");

    /** @type {number} Timestamp of start of previous frame */
    this.lastTimestamp = 0;
    /** @type {CanvasRenderingContext2D} Canvas rendering context */
    this.ctx = canvas.getContext("2d");
    /** @type {number} Hue */
    this.hue = 0;
    /** @type {number} Game width */
    this.gameW = 600;
    /** @type {number} Game height */
    this.gameH = 400;
    /** @type {Grid} level grid */
    this.ggrid = new Grid(GRID_W, GRID_H);
    /** @type {object[]} All game objects to process each frame */
    this.gameObjects = [];
    /** @type {Vec2} mouse X and Y coords relative to the game screen*/
    this.mouseGame = new Vec2(0, 0); //give it initial value to prevent undefined error

    // Make sure the canvas has the correct size
    canvas.width = this.gameW;
    canvas.height = this.gameH;

    document.addEventListener("mousemove", (e) => {
      //arrow used to keep the same "this"
      let mouse = new Vec2(e.clientX, e.clientY); //x, y //mouse coordinates relative to browser window
      //console.log(mouse.x + " , "+ mouse.y);

      let rect = this.ctx.canvas.getBoundingClientRect(); //ctx has a canvas object
      //coordinates change when resizing browser window

      //detect if mouse is inside game screen
      if (mouse.inRect(rect.left, rect.top, rect.right, rect.bottom)) {
        //sync mouse coordinates to game screen coordinates
        //to convert mouse to screen coord: subtract the rect.left and rect.top from the mouse coordinates
        this.mouseGame = mouse.sub(rect.left, rect.top);
        //console.log(this.mouseGame.x + " , "+this.mouseGame.y)
      }
    }); //end addEventListener

    document.addEventListener("mousedown", (e) => {
      // Call onMouseDown for each game object
      for (let obj of this.gameObjects) {
        isFunc(obj.onMouseDown) && obj.onMouseDown(e);
      }
    });

    document.addEventListener("mouseup", (e) => {
      // TODO handle mouse up event
      // If any game object has an "onMouseUp" function, try to call it.
      // Note the "of" keyword instead of "in" in the for loop. They're different.
      for (let obj of this.gameObjects) {
        isFunc(obj.onMouseUp) && obj.onMouseUp(e);
      }
    });
  }

  /**
   * Update the game to the next frame
   * @param {number} time timestamp (ms)
   */
  frame(time) {
    // Send the elapsed time in terms of seconds, not milliseconds
    this.update((time - this.lastTimestamp) / 1000);
    this.draw();
    // Update the timestamp for the next frame
    this.lastTimestamp = time;
    // Next frame
    requestAnimationFrame((t) => this.frame(t));
  }

  /**
   * Update the game state
   * @param {number} elapsed elapsed time in seconds
   */
  update(elapsed) {
    // Update the color
    this.hue = (this.hue + elapsed * 50) % 360;
    // Update all game objects
    for (let obj of this.gameObjects) {
      obj.update(elapsed);
    }
  }

  draw() {
    const ctx = this.ctx;

    // Draw the background
    ctx.fillStyle = `hsl(${this.hue}, 100%, 80%)`;
    ctx.fillRect(0, 0, this.gameW, this.gameH);

    // Draw game objects
    for (let obj of this.gameObjects) {
      obj.draw(ctx);
    }
  }

  /**
   * Load a level string
   * @param {string} text
   */
  loadLevel(text) {
    const dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const grid = [];
    // Error checking is for people with more than 13kb of code
    for (let i = 0; i < text.length; i += 1) {
      const item = dict.indexOf(text.charAt(i));
      grid.push(item);
      switch (
        item
        // TODO create objects
      ) {
      }
    }
    // TODO convert grid to 2D array, store it
  }

  addObjects(...objects) {
    for (let o of objects) {
      o.game = this;
      this.gameObjects.push(o);
      isFunc(o.onAdded) && o.onAdded();
    }
  }

  /**
   * Remove one or more objects from the game
   * @param  {...any} objects Objects to remove from the game
   */
  removeObjects(...objects) {
    const gob = this.gameObjects;
    for (const o of objects) {
      let i = gob.indexOf(o);
      if (i !== -1) {
        arraySwap(gob, i, gob.length - 1);
        gob.pop();
      }
    }
  }

  /**
   * Start running the game
   */
  run() {
    // make the objects that go in the game
    // later put the load level stuff here
    initTestLevel(this);
    // This is required to get the proper elapsed time
    this.lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }
}

/**
 * Initialize the test level
 * @param {Game} game
 */
function initTestLevel(game) {
  //make a new laser shooter
  //we could define this.shoot in the game constructor but nahhhh im lazy
  let shooter1 = new Shooter(toView(Vec2.of(2, 2)), Direction.East);
  let shooter2 = new Shooter(toView(Vec2.of(2, 4)), Direction.North);
  let shooter3 = new Shooter(toView(Vec2.of(3, 4)), Direction.East);

  // Actually add our objects to the game
  game.addObjects(shooter1, shooter2, shooter3);
}
