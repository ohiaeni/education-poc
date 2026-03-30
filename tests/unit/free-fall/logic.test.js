import { describe, it, expect } from "vitest";
import {
  updateFreeFall,
  ballCanvasY,
  GRAVITY,
  SCALE_PX_PER_M,
  GROUND_TOP_Y,
  BALL_RADIUS_PX,
} from "../../../simulations/free-fall/js/logic.js";

const EPS = 1e-9;

describe("updateFreeFall", () => {
  it("初期状態（velocity=0）から1ステップ後に高さが減少し速度が増加する", () => {
    const result = updateFreeFall(50, 0, 1 / 30, 0.8);
    expect(result.velocity).toBeGreaterThan(0);
    expect(result.height).toBeLessThan(50);
    expect(result.bounced).toBe(false);
  });

  it("重力加速度に従って速度が増加する", () => {
    const dt = 1 / 30;
    const result = updateFreeFall(50, 0, dt, 0.8);
    const expectedVelocity = GRAVITY * dt;
    expect(result.velocity).toBeCloseTo(expectedVelocity, 10);
  });

  it("地面に到達すると反発する（e=0.8）", () => {
    // 地面ギリギリの状態から落下
    const dt = 1 / 30;
    const result = updateFreeFall(0.01, 10, dt, 0.8);
    expect(result.bounced).toBe(true);
    expect(result.height).toBe(0);
    // 反発後の速度は下向き速度に -e を掛けた値
    expect(result.velocity).toBeLessThan(0);
  });

  it("e=0（完全非弾性衝突）では反発後の速度が0になる", () => {
    const dt = 1 / 30;
    const result = updateFreeFall(0.01, 10, dt, 0);
    expect(result.bounced).toBe(true);
    expect(result.velocity).toBeCloseTo(0, 10);
  });

  it("e=1（完全弾性衝突）では反発後の速度の絶対値が衝突前と等しい", () => {
    const dt = 1 / 30;
    const velocityBefore = 10;
    const result = updateFreeFall(0.01, velocityBefore, dt, 1);
    expect(result.bounced).toBe(true);
    const newVelocityBeforeBounce = velocityBefore + GRAVITY * dt;
    expect(Math.abs(result.velocity)).toBeCloseTo(Math.abs(newVelocityBeforeBounce), 5);
  });

  it("高さが十分ある場合はバウンドしない", () => {
    const result = updateFreeFall(100, 0, 1 / 30, 0.8);
    expect(result.bounced).toBe(false);
    expect(result.height).toBeGreaterThan(0);
  });

  it("反発係数が大きいほど反発後の速度が大きい", () => {
    const dt = 1 / 30;
    const r1 = updateFreeFall(0.01, 10, dt, 0.5);
    const r2 = updateFreeFall(0.01, 10, dt, 0.9);
    expect(Math.abs(r2.velocity)).toBeGreaterThan(Math.abs(r1.velocity));
  });
});

describe("ballCanvasY", () => {
  it("高さ0のとき、ボール中心は地面の上にBALL_RADIUS_PX分だけ位置する", () => {
    const y = ballCanvasY(0);
    expect(y).toBe(GROUND_TOP_Y - BALL_RADIUS_PX);
  });

  it("高さが増えるほどY座標は小さくなる（上方向）", () => {
    const y0 = ballCanvasY(0);
    const y50 = ballCanvasY(50);
    const y100 = ballCanvasY(100);
    expect(y50).toBeLessThan(y0);
    expect(y100).toBeLessThan(y50);
  });

  it("1メートルあたり SCALE_PX_PER_M ピクセル移動する", () => {
    const y0 = ballCanvasY(0);
    const y1 = ballCanvasY(1);
    expect(y0 - y1).toBeCloseTo(SCALE_PX_PER_M, 10);
  });
});
