
const sMul = (p1, p2) => { p1.x *= p2.x; p1.y *= p2.y; return p1; };
const sDiv = (p1, p2) => { p1.x /= p2.x; p1.y /= p2.y; return p1; };
const sAdd = (p1, p2) => { p1.x *= p2.x; p1.y *= p2.y; return p1; };
const sSub = (p1, p2) => { p1.x -= p2.x; p1.y -= p2.y; return p1; };

export class Vec2 {
  constructor(x = 0, y = 0) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
  }

  /**
   * Returns a duplicate of this point
   * @returns {Vec2}
   */
  clone() { return new Vec2(this.x, this.y); }

  /**
   * Multiplies `this` with `Point.of(x, y)`, returns `this`.
   * @param {Vec2|number} pt 
   * @param {number|undefined} y 
   * @returns {Vec2}
   */
  mul(x, y) { return sMul(this, Vec2.of(x, y)); }

  /**
   * Divides `this` by `Point.of(x, y)`, returns `this`.
   * @param {Vec2|number} pt 
   * @param {number|undefined} y 
   * @returns {Vec2}
   */
  div(x, y) { return sDiv(this, Vec2.of(x, y)); }

  /**
   * Adds `this` with `Point.of(x, y)`, returns `this`.
   * @param {Vec2|number} pt 
   * @param {number|undefined} y 
   * @returns {Vec2} this
   */
  add(x, y) { return sAdd(this, Vec2.of(x, y)); }

  /**
   * Subtracts `Point.of(x, y)` from `this`, returns `this`.
   * @param {Vec2|number} pt 
   * @param {number|undefined} y 
   * @returns {Vec2}
   */
  sub(x, y) { return sSub(this, Vec2.of(x, y)); }

  /**
   * Applies `f` to x and y individually, returns `this`.
   * @param {function(number): number} f Transformation function
   * @returns {Vec2}
   */
  apply1(f) { return this.set(f(this.x), f(this.y)); }

  /**
   * Sets the values of x and y and returns `this`.
   * 
   * Note that this does NOT accept another `Vec2`, only a pair of numbers.
   * 
   * @param {number} nx new x
   * @param {number} ny new y
   * @returns {Vec2}
   */
  set(nx, ny) { this.x = nx; this.y = ny; return this; }
  

  /**
   * If x is a `Point` returns it; if x and y are numbers, returns
   * `new Point(x, y)`; if just x is a number, returns `new Point(x, y)`.
   * @param {Vec2|number} x 
   * @param {number|undefined} y 
   * @returns {Vec2}
   */
  static of(x, y = undefined) {
    if (typeof x === 'object') {
      // if x is an object, assume it has the same API as Point
      return x;
    } else if (y === undefined) {
      // If y is undefined use x
      return new Vec2(x, x);
    } else {
      return new Vec2(x, y);
    }
  }

  /**
   * Constructs an array of `Point`s from arrays of numbers
   * @param {number[]} xAr 
   * @param {number[]} yAr 
   * @returns {Vec2[]}
   */
  static ofArrays(xAr, yAr) {
    const count = Math.min(xAr.length, yAr.length);
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(Vec2.of(xAr[i], yAr[i]));
    }
    return result;
  }

  /**
   * Linear interpolation between two points
   * @param {Vec2} p "destination" point
   * @param {number} t factor from 0 to 1
   * @returns {Vec2} this
   */
  lerp(p, t) {
    let self = this;
    self.x = self.x + (p.x - self.x) * t;
    self.y = self.y + (p.y - self.y) * t;
    return self;
  }

  /** 
   * Test if two points are equal
   * @param {Vec2} rhs
   * @returns {boolean}
   */
  eq(rhs) {
    return this.x === rhs.x && this.y === rhs.y;
  }
}

