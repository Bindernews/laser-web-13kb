import { GRID_H, GRID_W } from "./constants";
import { Vec2 } from "./vec2";

export const D_RIGHT = 0;
export const D_UP = 1;
export const D_LEFT = 2;
export const D_DOWN = 3;

/**
 * @param {number} w Width of the grid (in grid spaces)
 * @param {number} h Height of the grid (in grid spaces)
 * @returns {Grid} A new Grid object
 */
function newGrid(w, h) {
  const o = {
    w: w,
    h: h,

    //this is a 1D array. it's faster than a 2D array
    /** @type {number[]} */
    data: new Array(w * h).fill(0),

    /**
     * Get the value in the grid at the requested coordinates
     * @param {number} x 
     * @param {number} y 
     * @returns {number|undefined}
     */
    get(x, y) {
      return o.inBounds(x, y) //inBounds checks if its a valid grid position
        ? o.data[y * w + x]
        : undefined;
    },

    /**
     * Set the value in the grid at the requested coordinates
     * @param {number} x 
     * @param {number} y 
     * @param {number} v 
     */
    set(x, y, v) {
      if (o.inBounds(x, y)) {
        o.data[y * w + x] = v;
      }
    },
    inBounds(x, y) {
      return !(x < 0 || x >= w || y < 0 || y >= h);
    },
  };
  return o;
}


class RotateShooter {
  pos = new Vec2(0, 0);
  direction = D_RIGHT;

  fire() {
    
  }

  draw(ctx) {
    
  }

  onHit(direction) {
    let d = this.direction - 1;
    if (d < 0) {
      d = D_DOWN;
    }
    this.direction = d;
  }
}
//let rotate = new RotateShooter();
//rotate.draw(this.ctx);
class Shooter {
  //shoots a laser when clicked
  //only shoots to the right
  //never rotates
  constructor(centerX, centerY, radius){
    /** @type {Vec2} */
    this.center = Vec2.of(centerX, centerY);
    this.radius = radius;
    /** @type {Game} */
    this.game = null
  }

  draw(ctx){
    //draw a circle - we will determine if player clicks on this
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false); //centerX, centerY, radius //25 25 10
    ctx.fillStyle = "blue";
    ctx.fill();
    //end draw circle
  }
  update(elapsed){
    //do nothing
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseDown(e) {
    let c = this.center;
    if (this.game.mouseGame.inCircle(c.x, c.y, this.radius)) {
      console.log("great job u clicked on the shooter you win!!!");
    }
  }

  //add code to detect player clicks
  mouseInShooter(game)//this in the bigger picture is the "game" this. pass this as a parameter, and set it to game
  {
    //return true if mouse is over Shooter
    let mouseinshoot = game.mouseGame.inCircle(this.centerX, this.centerY, this.radius);
    return mouseinshoot;
  }
}

class Laser{
  //moves to the right forever
  //TODO: make it start in a direction based on constructor
  //TODO: Add collision detection based on if it hits mirror
  constructor(pos, velocity)
  {
    //pos is (x,y) coord
    //this.pos.x and this.pos.y are the X and Y coordinates
    //velocity is (x,y) velocity
    //this.velocity.x and this.velocity.y are 
    //pos (x,y) is top left corner of laser because of how fillRect works
    this.pos = pos;
    this.velocity = velocity;
  }
  draw(ctx){
    ctx.fillRect(this.pos.x, this.pos.y, 10, 2); //(x, y, width, height)
  }

  update(elapsed){
    this.pos.add(elapsed*this.velocity.x,elapsed*this.velocity.y);
  }
}

/**
 * @class Main game state
 */
export class Game {
  constructor() {
    // NOTE: Some names (like ggrid) are that way to help the name-mangler
    // reduce the code size.
    let canvas = document.getElementById('render')

    /** @type {number} Timestamp of start of previous frame */
    this.lastTimestamp = 0;
    /** @type {CanvasRenderingContext2D} Canvas rendering context */
    this.ctx = canvas.getContext('2d');
    /** @type {number} Hue */
    this.hue = 0;
    /** @type {number} Game width */
    this.gameW = 600;
    /** @type {number} Game height */
    this.gameH = 400;
    /** @type {Grid} level grid */
    this.ggrid = newGrid(GRID_W, GRID_H);
    /** @type {object[]} */
    this.gameObjects = []
    /** @type {Vec2} mouse X and Y coords relative to the game screen*/
    this.mouseGame = new Vec2(0,0); //give it initial value to prevent undefined error

    // Make sure the canvas has the correct size
    canvas.width = this.gameW
    canvas.height = this.gameH

    document.addEventListener("mousemove", (e) => { //arrow used to keep the same "this"
      let mouse = new Vec2(e.clientX, e.clientY); //x, y //mouse coordinates relative to browser window
      //console.log(mouse.x + " , "+ mouse.y);

      let rect = this.ctx.canvas.getBoundingClientRect(); //ctx has a canvas object
      //coordinates change when resizing browser window

      //detect if mouse is inside game screen
      if(mouse.inRect(rect.left, rect.top, rect.right, rect.bottom)) {
        //sync mouse coordinates to game screen coordinates
        //to convert mouse to screen coord: subtract the rect.left and rect.top from the mouse coordinates
        this.mouseGame = mouse.sub(rect.left, rect.top);
        //console.log(this.mouseGame.x + " , "+this.mouseGame.y)
      }
    }); //end addEventListener

    document.addEventListener("mousedown", (e) => {
      //test if mouse is in shooter
      //TODO: loop thru a list of all shooters and test if the mouse is in each of them
      this.gameObjects.forEach(obj => {
        if (obj.onMouseDown) {
          obj.onMouseDown(e);
        }
      });
    });

    document.addEventListener("mouseup", (e) => {
      // TODO handle mouse up event
      // If any game object has an "onMouseUp" function, try to call it.
      // Note the "of" keyword instead of "in" in the for loop. They're different.
      for (obj of this.gameObjects) {
        if (obj.onMouseUp) {
          obj.onMouseUp(e);
        }
      }
    });
  }

  /**
   * Update the game to the next frame
   * @param {number} time timestamp (ms)
   */
  frame(time) {
    // Example game loop
    this.update(time - this.lastTimestamp);
    this.draw();
    // Update the timestamp for the next frame
    this.lastTimestamp = time;
    // Next frame
    requestAnimationFrame((t) => this.frame(t));
  }

  /**
   * Update the game state
   * @param {number} elapsed elapsed time in ms
   */
  update(elapsed) {
    // Update the color
    this.hue = (this.hue + elapsed / 100) % 360;
    //move the laser
    
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
      switch (item) {
        // TODO create objects
      }
    }
    // TODO convert grid to 2D array, store it
  }

  addObjects(...objects) {
    for (let o of objects) {
      o.game = this;
      this.gameObjects.push(o);
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
    let shooter = new Shooter(50, 50, 10);
    let laser = new Laser(new Vec2(60, 50), new Vec2(0.1, 0));//pos vec, velocity vec

    // Actually add our objects to the game
    game.addObjects(shooter, laser);
}
