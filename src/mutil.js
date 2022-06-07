import { Vec2 } from "./vec2";
import { GRID_SIZE } from "./constants";

/**
 * Returns true if numbers are close
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
export function near(a, b) {
  return Math.abs(x - y) <= 0.01;
}

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function isFunc(o) {
  return typeof o === "function";
}

export function toGrid(v) {
  return Vec2.of(v.x / GRID_SIZE, v.y / GRID_SIZE);
}

export function toView(v) {
  return Vec2.of(v.x * GRID_SIZE, v.y * GRID_SIZE);
}

/**
 * Translate and rotate the passed rendering context
 * @param {CanvasRenderingContext2D} ctx
 * @param {Vec2} pos
 * @param {number} angle
 */
export function canvasRotateMove(ctx, pos, angle) {
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(angle);
}

export function arraySwap(a, i, j) {
  let t = a[i];
  a[i] = a[j];
  a[j] = t;
}
