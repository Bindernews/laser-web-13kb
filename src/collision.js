import { Vec2 } from "./vec2";

/**
 * @property {Vec2} center
 */
export class Shape {
  /**
   * Returns true if this shape collides with other
   * @param {Shape} other
   */
  test(other) {
    throw `cannot collide ${this.shape} with ${other.shape}`;
  }
}

export class CircleShape extends Shape {
  constructor(center, radius) {
    super();
    this.center = center;
    this.radius = radius;
    this.shape = "circle";
  }

  test(other) {
    if (other === null) {
      return false;
    } else if (other.shape === "circle") {
      return collideCircleCircle(
        this.center,
        this.radius,
        other.center,
        other.radius
      );
    } else if (other.shape === "triangle") {
      return other.collideCircle(this);
    } else {
      return super.test(other);
    }
  }
}

export class TriangleShape extends Shape {
  constructor(center, a, b, c) {
    super();
    this.center = center;
    this.a = a;
    this.b = b;
    this.c = c;
    this.shape = "triangle";
  }

  test(other) {
    if (other === null) {
      return false;
    } else if (other.shape === "circle") {
      return this.collideCircle(other);
    } else {
      return super.test(other);
    }
  }

  collideCircle(other) {
    let [ta, tb, tc] = this.getPoints();
    return collideCircleTriangle(other.center, other.radius, ta, tb, tc);
  }

  getPoints() {
    const off = (v) => this.center.clone().add(v);
    return [off(this.a), off(this.b), off(this.c)];
  }
}

/**
 * Test if two circles collide
 * @param {Vec2} c1 center 1
 * @param {number} r1 radius 1
 * @param {Vec2} c2 center 2
 * @param {number} r2 radius 2
 * @returns {boolean}
 */
export function collideCircleCircle(c1, r1, c2, r2) {
  const r3 = r1 + r2;
  return c2.clone().sub(c1).lenSq() <= r3 * r3;
}

/**
 * Returns true if the circle and triangle collide, false if not
 * @param {Vec2} c Circle center
 * @param {number} r circle radius
 * @param {Vec2} ta triangle point a
 * @param {Vec2} tb triangle point b
 * @param {Vec2} tc triangle point c
 * @returns {boolean}
 */
export function collideCircleTriangle(c, r, ta, tb, tc) {
  let tp = pointOnTriangle(c, ta, tb, tc);
  return tp.inCircle(c.x, c.y, r);
}

/**
 * Returns the closest point to `point` that is on/inside the triangle.
 * @param {Vec2} point point to place on triangle
 * @param {Vec2} ta
 * @param {Vec2} tb
 * @param {Vec2} tc
 * @returns {Vec2}
 */
export function pointOnTriangle(point, ta, tb, tc) {
  // See https://2dengine.com/?p=intersections#Nearest_point_on_a_triangle
  let tab = tb.clone().sub(ta);
  let tac = tc.clone().sub(ta);
  // vertex region outside t1
  let tap = point.clone().sub(ta);
  let d1 = tab.dot(tap);
  let d2 = tac.dot(tap);
  if (d1 <= 0 && d2 <= 0) {
    return ta;
  }
  // vertex region outside t2
  let tbp = point.clone().sub(tb);
  let d3 = tab.dot(tbp);
  let d4 = tac.dot(tbp);
  if (d3 >= 0 && d4 <= d3) {
    return tb;
  }
  // edge region ab
  if (d1 >= 0 && d3 <= 0 && d1 * d4 - d3 * d2 <= 0) {
    let v = d1 / (d1 - d3);
    return tab.mul(v).add(ta);
  }
  // vertex region outside c
  let tcp = point.clone().sub(tc);
  let d5 = tab.dot(tcp);
  let d6 = tac.dot(tcp);
  if (d6 >= 0 && d5 <= d6) {
    return tc;
  }
  // edge region ac
  if (d2 >= 0 && d6 <= 0 && d5 * d2 - d1 * d6 <= 0) {
    let w = d2 / (d2 - d6);
    return tac.mul(w).add(ta);
  }
  // edge region bc
  if (d3 * d6 - d5 * d4 <= 0) {
    let d43 = d4 - d3;
    let d56 = d5 - d6;
    if (d43 >= 0 && d56 >= 0) {
      let w = d43 / (d43 + d56);
      return tc.clone().sub(tb).mul(w).add(tb);
    }
  }
  // inside face region
  return point;
}
