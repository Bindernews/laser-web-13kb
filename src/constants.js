import { Vec2 } from "./vec2";

export const GRID_SIZE = 32;
export const COLOR_WHITE = 0xffffff;
export const COLOR_OUTLINE = 0x0f0f0f;
export const COLOR_HIGHLIGHT_1 = 0x0000ff;
export const BALL_SIZE = 12;
export const GRID_W = 8;
export const GRID_H = 8;
export const LASER_SPEED = GRID_SIZE * 4;

/** @enum {number} */
export const Direction = {
  East: 0,
  North: 3,
  West: 2,
  South: 1,

  /**
   * Converts the direction into a unit vector
   * @param {Direction} d
   * @returns {Vec2}
   */
  toVec(d) {
    switch (d) {
      case 0:
        return Vec2.of(1, 0);
      case 3:
        return Vec2.of(0, -1);
      case 2:
        return Vec2.of(-1, 0);
      case 1:
        return Vec2.of(0, 1);
    }
  },

  /**
   * Wrap the given direction to be one of the valid constants
   * @param {Direction} n
   * @returns {Direction}
   */
  wrap(n) {
    let n2 = n % 4;
    return n2 < 0 ? n2 + 4 : n2;
  },
};
