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

/**
 * @class Main game state
 */
export class Game {
  constructor() {
    // NOTE: Some names (like ggrid) are that way to help the name-mangler
    // reduce the code size.




    /** @type {number} Timestamp of start of previous frame */
    this.lastTimestamp = 0;
    /** @type {CanvasRenderingContext2D} Canvas rendering context */
    this.ctx = document.getElementById('render').getContext('2d');
    /** @type {number} Hue */
    this.hue = 0;
    /** @type {number} Game width */
    this.gameW = 600;
    /** @type {number} Game height */
    this.gameH = 400;
    /** @type {Array<Array<number>>} level grid */
    this.ggrid = [[]];
    /** @type {Vec2} mouse X and Y coords relative to the game screen*/
    this.mouseGame;
    document.addEventListener("mousemove", (e) => { //arrow used to keep the same "this"
      let mouse = new Vec2(e.clientX, e.clientY); //x, y //mouse coordinates relative to browser window
      //console.log(mouse.x + " , "+ mouse.y);


      let rect = this.ctx.canvas.getBoundingClientRect(); //ctx has a canvas object
      //console.log(rect.top, rect.right, rect.bottom, rect.left); //top 8 right 626.5 bottom 408 left 26.5
      //coordinates change when resizing browser window
      //rect.top, rect.right is 0,0

      //detect if mouse is inside game screen
      if(mouse.x >= rect.left && mouse.x <= rect.right && mouse.y >= rect.top && mouse.y <= rect.bottom) //if mouse is inside game screen
      {
        console.log("mouse x and y coord inside game screen");
        //sync mouse coordinates to game screen coordinates
        //to convert mouse to screen coord: subtract the rect.left and rect.top from the mouse coordinates
        this.mouseGame = mouse.sub(rect.left, rect.top);
        console.log(this.mouseGame.x + " , "+this.mouseGame.y)

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
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = `hsl(${this.hue}, 100%, 80%)`;
    ctx.fillRect(0, 0, this.gameW, this.gameH);
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
    this.lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }
}