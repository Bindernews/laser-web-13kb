import { Shape } from "./collision";
import { Vec2 } from "./vec2";
import { clamp, toGrid } from "./mutil";

export class Grid {
  /**
   * @param {number} w Width of the grid (in grid spaces)
   * @param {number} h Height of the grid (in grid spaces)
   */
  constructor(w, h) {
    const o = this;
    o.w = w;
    o.h = h;
    //this is a 1D array. it's faster than a 2D array
    /** @type {object[]} */
    o.data = new Array(w * h).fill(null);

    /**
     * Get the value in the grid at the requested coordinates
     * @param {number} x
     * @param {number} y
     * @returns {object|null}
     */
    o.get = (x, y) => {
      return o.inBounds(x, y) //inBounds checks if its a valid grid position
        ? o.data[y * w + x]
        : null;
    };

    /**
     * Set the value in the grid at the requested coordinates
     * @param {number} x
     * @param {number} y
     * @param {object|null} v
     */
    o.set = (x, y, v) => {
      if (o.inBounds(x, y)) {
        o.data[y * w + x] = v;
      }
    };

    /**
     * Clamp the given vector to be within the grid bounds
     * @param {Vec2} v
     */
    o.clamp = (v) => {
      return Vec2.of(clamp(v.x, 0, o.w - 1) | 0, clamp(v.y, 0, o.h - 1) | 0);
    };

    o.inBounds = (x, y) => {
      return !(x < 0 || x >= w || y < 0 || y >= h);
    };
  }

  /**
   * Returns list of objects that the given shape collided with, or empty list.
   *
   * The passed shape must NOT be larger than 2x2 grid squares, otherwise the
   * function might fail.
   *
   * @param {Shape} shape shape to test collisions with
   * @returns {object[]}
   */
  getCollisions(shape) {
    let sc = toGrid(shape.center);
    // radius of cells to check, COULD calculate from shape, but for now this is fine
    const radius = 1;
    let g0 = this.clamp(sc.clone().sub(radius));
    let g1 = this.clamp(sc.clone().add(radius));
    let results = [];
    for (let y = g0.y; y <= g1.y; y += 1) {
      for (let x = g0.x; x <= g1.x; x += 1) {
        let cell = this.data[y * this.w + x];
        if (cell && shape.test(cell.collider || null)) {
          results.push(cell);
        }
      }
    }
    return results;
  }
}
