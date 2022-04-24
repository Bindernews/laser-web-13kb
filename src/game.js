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
    this.ctx = document.getElementById("render").getContext("2d");
    /** @type {number} Hue */
    this.hue = 0;
    /** @type {number} Game width */
    this.gameW = 600;
    /** @type {number} Game height */
    this.gameH = 400;
    /** @type {Array<Array<number>>} level grid */
    this.ggrid = [[]];
    /** @type {number} X coordinate of the rectangle */
    this.rectangleXcoord = 0;
    /** @type {number} Y coordinate of the rectangle */
    this.rectangleYcoord = 0;
    /** @type {number} velocity of the rectangle */
    this.rectanglevelocity = 0.1;

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
    this.rectangleXcoord = this.rectangleXcoord + elapsed*this.rectanglevelocity;
    //console.log(this.rectangleXcoord);
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = `hsl(${this.hue}, 100%, 80%)`;
    ctx.fillRect(0, 0, this.gameW, this.gameH);
    //draw a rectangle
    ctx.fillStyle = "green";
    ctx.fillRect(this.rectangleXcoord, 20, 10, 10); //(x, y, width, height)
    //draw a circle
    ctx.beginPath();
    ctx.arc(50, 50, 10, 0, 2 * Math.PI, false); //centerX, centerY, radius
    ctx.fillStyle = "blue";
    ctx.fill();
    //draw a half circle
    ctx.beginPath();
    ctx.arc(100, 50, 10, 0, Math.PI, false); //centerX, centerY, radius
    ctx.fillStyle = "red";
    ctx.fill();
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

  /**
   * Start running the game
   */
  run() {
    this.lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }
}
