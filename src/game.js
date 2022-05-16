import { Vec2 } from "./vec2";

export const D_RIGHT = 0;
export const D_UP = 1;
export const D_LEFT = 2;
export const D_DOWN = 3;


function newGrid(w, h) {
  const o = {
    /** @type {number[]} */
    data: new Array(w * h).fill(0),

    /**
     * Get the value in the grid at the requested coordinates
     * @param {number} x 
     * @param {number} y 
     * @returns {number|undefined}
     */
    get(x, y) {
      return o.inBounds(x, y) 
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



/**
 * @implements {IGameObject}
 */
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
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
  }

  draw(ctx){
    //draw a circle - we will determine if player clicks on this
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false); //centerX, centerY, radius //25 25 10
    ctx.fillStyle = "blue";
    ctx.fill();
    //end draw circle
  }

  //add code to detect player clicks
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
    /** @type {Array<Array<number>>} level grid */
    this.ggrid = [[]];
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
      // TODO handle mouse down event
    });

    document.addEventListener("mouseup", (e) => {
      // TODO handle mouse up event
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



    let bool1 = this.mouseGame.inCircle(25, 25, 10);//centerx, centery, radius
    //determine if mouse is inside circle
    if(bool1) {
      console.log("in circle");
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = `hsl(${this.hue}, 100%, 80%)`;
    ctx.fillRect(0, 0, this.gameW, this.gameH);

    
    this.shoot.draw(this.ctx);


    
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

  /**
   * Start running the game
   */
  run() {
    //make the objects that go in the game
    //later put the load level stuff here

    //make a new laser shooter
    this.shoot = new Shooter(50, 50, 10); //use this so that it is in the scope of the game
    //we could define this.shoot in the game constructor but nahhhh im lazy
    this.lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }
}