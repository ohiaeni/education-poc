import { describe, it, expect } from "vitest";
import {
  calculatePosition,
  calculateFlightTime,
  calculateMaxHeight,
  calculateRange,
  getSecondMarkers,
  calculateScale,
} from "../../../simulations/projectile-motion/js/logic.js";

describe("calculatePosition", () => {
  it("t=0 のとき原点（発射点）にある", () => {
    const pos = calculatePosition(15, 30, 0, 9.8);
    expect(pos.x).toBeCloseTo(0, 10);
    expect(pos.y).toBeCloseTo(0, 10);
  });

  it("水平速度は v0 * cosθ に等しい（x = v0x * t）", () => {
    const v0 = 20;
    const angleDeg = 45;
    const t = 2;
    const g = 9.8;
    const theta = (angleDeg * Math.PI) / 180;
    const v0x = v0 * Math.cos(theta);
    const pos = calculatePosition(v0, angleDeg, t, g);
    expect(pos.x).toBeCloseTo(v0x * t, 5);
  });

  it("頂点（T/2）では y が最高の高さに等しい", () => {
    const v0 = 15;
    const angleDeg = 30;
    const g = 9.8;
    const T = calculateFlightTime(v0, angleDeg, g);
    const pos = calculatePosition(v0, angleDeg, T / 2, g);
    const H = calculateMaxHeight(v0, angleDeg, g);
    expect(pos.y).toBeCloseTo(H, 5);
  });

  it("着地時刻（T）では y ≈ 0 になる", () => {
    const v0 = 20;
    const angleDeg = 60;
    const g = 9.8;
    const T = calculateFlightTime(v0, angleDeg, g);
    const pos = calculatePosition(v0, angleDeg, T, g);
    expect(Math.abs(pos.y)).toBeLessThan(1e-5);
  });

  it("角度が大きいほど y の変化が大きい（初期の上昇が急）", () => {
    const v0 = 20;
    const g = 9.8;
    const t = 0.5;
    const pos30 = calculatePosition(v0, 30, t, g);
    const pos60 = calculatePosition(v0, 60, t, g);
    expect(pos60.y).toBeGreaterThan(pos30.y);
  });
});

describe("calculateFlightTime", () => {
  it("θ=90° のとき T = 2 * v0 / g", () => {
    const v0 = 10;
    const g = 9.8;
    const T = calculateFlightTime(v0, 90, g);
    expect(T).toBeCloseTo((2 * v0) / g, 5);
  });

  it("θ=30° のとき T = 2 * v0 * sin30° / g = v0 / g", () => {
    const v0 = 20;
    const g = 9.8;
    const T = calculateFlightTime(v0, 30, g);
    expect(T).toBeCloseTo(v0 / g, 5);
  });

  it("θ=0°（水平）のとき T = 0（地面への初速がない）", () => {
    const T = calculateFlightTime(10, 0, 9.8);
    expect(T).toBe(0);
  });

  it("θが同じなら v0 が大きいほど滞空時間が長い", () => {
    const g = 9.8;
    const T1 = calculateFlightTime(10, 45, g);
    const T2 = calculateFlightTime(20, 45, g);
    expect(T2).toBeGreaterThan(T1);
  });

  it("g が大きいほど滞空時間が短い", () => {
    const T_earth = calculateFlightTime(15, 45, 9.8);
    const T_moon = calculateFlightTime(15, 45, 1.62);
    expect(T_moon).toBeGreaterThan(T_earth);
  });
});

describe("calculateMaxHeight", () => {
  it("θ=90° のとき H = v0² / (2g)（最大）", () => {
    const v0 = 10;
    const g = 9.8;
    const H = calculateMaxHeight(v0, 90, g);
    expect(H).toBeCloseTo((v0 * v0) / (2 * g), 5);
  });

  it("θ=30° のとき H = (v0 * sin30°)² / (2g)", () => {
    const v0 = 20;
    const g = 9.8;
    const H = calculateMaxHeight(v0, 30, g);
    const v0y = v0 * Math.sin((30 * Math.PI) / 180);
    expect(H).toBeCloseTo((v0y * v0y) / (2 * g), 5);
  });

  it("θ=45° のとき H と R の関係: R = 4H (tanθ=1 の場合)", () => {
    // R = v0²sin(2θ)/g = v0²sin(90°)/g = v0²/g
    // H = v0²sin²θ/(2g) = v0²*0.5/(2g) = v0²/(4g)
    // なので R = 4H
    const v0 = 20;
    const g = 9.8;
    const H = calculateMaxHeight(v0, 45, g);
    const R = calculateRange(v0, 45, g);
    expect(R).toBeCloseTo(4 * H, 5);
  });

  it("v0 が2倍になると H は4倍になる", () => {
    const g = 9.8;
    const H1 = calculateMaxHeight(10, 45, g);
    const H2 = calculateMaxHeight(20, 45, g);
    expect(H2).toBeCloseTo(4 * H1, 5);
  });
});

describe("calculateRange", () => {
  it("θ=45° のとき飛距離が最大 R = v0² / g", () => {
    const v0 = 20;
    const g = 9.8;
    const R45 = calculateRange(v0, 45, g);
    expect(R45).toBeCloseTo((v0 * v0) / g, 5);
  });

  it("θ=30° と θ=60° で飛距離が等しい（sin(2θ) の対称性）", () => {
    const v0 = 20;
    const g = 9.8;
    const R30 = calculateRange(v0, 30, g);
    const R60 = calculateRange(v0, 60, g);
    expect(R30).toBeCloseTo(R60, 5);
  });

  it("θ=0°（水平）のとき飛距離 = 0", () => {
    const R = calculateRange(10, 0, 9.8);
    expect(R).toBeCloseTo(0, 5);
  });

  it("θ=90°（垂直）のとき飛距離 = 0", () => {
    const R = calculateRange(10, 90, 9.8);
    expect(R).toBeCloseTo(0, 5);
  });

  it("v0 が2倍になると飛距離は4倍になる", () => {
    const g = 9.8;
    const R1 = calculateRange(10, 45, g);
    const R2 = calculateRange(20, 45, g);
    expect(R2).toBeCloseTo(4 * R1, 5);
  });
});

describe("getSecondMarkers", () => {
  it("滞空時間 < 1s のとき空配列を返す", () => {
    // θ=30°, v0=2 m/s: T = 2*2*sin30°/9.8 ≈ 0.20s
    const markers = getSecondMarkers(2, 30, 9.8);
    expect(markers).toHaveLength(0);
  });

  it("滞空時間 T のとき floor(T) 個のマーカーを返す", () => {
    // θ=90°, v0=15 m/s: T = 2*15/9.8 ≈ 3.06s → floor(T) = 3
    const markers = getSecondMarkers(15, 90, 9.8);
    const T = calculateFlightTime(15, 90, 9.8);
    expect(markers).toHaveLength(Math.floor(T));
  });

  it("各マーカーの y 座標は 0 以上（地面より上）", () => {
    const markers = getSecondMarkers(20, 45, 9.8);
    for (const m of markers) {
      expect(m.y).toBeGreaterThanOrEqual(0);
    }
  });

  it("マーカーの x 座標は時刻が増えるほど大きい（水平方向に進む）", () => {
    const markers = getSecondMarkers(30, 45, 9.8);
    for (let i = 1; i < markers.length; i++) {
      expect(markers[i].x).toBeGreaterThan(markers[i - 1].x);
    }
  });

  it("各マーカーの位置は calculatePosition と一致する", () => {
    const v0 = 20;
    const angleDeg = 45;
    const g = 9.8;
    const markers = getSecondMarkers(v0, angleDeg, g);
    markers.forEach((m, i) => {
      const expected = calculatePosition(v0, angleDeg, i + 1, g);
      expect(m.x).toBeCloseTo(expected.x, 5);
      expect(m.y).toBeCloseTo(expected.y, 5);
    });
  });
});

describe("calculateScale", () => {
  it("正のスケールを返す", () => {
    const scale = calculateScale(15, 30, 9.8, 860, 380);
    expect(scale).toBeGreaterThan(0);
  });

  it("v0=0 のとき安全にデフォルト値 10 を返す", () => {
    const scale = calculateScale(0, 30, 9.8, 860, 380);
    expect(scale).toBe(10);
  });

  it("θ=0 のとき安全にデフォルト値 10 を返す（高さ 0）", () => {
    const scale = calculateScale(15, 0, 9.8, 860, 380);
    expect(scale).toBe(10);
  });

  it("v0 が大きいほどスケールが小さい（軌跡が大きいので縮小）", () => {
    const s1 = calculateScale(10, 45, 9.8, 860, 380);
    const s2 = calculateScale(30, 45, 9.8, 860, 380);
    expect(s2).toBeLessThan(s1);
  });

  it("利用可能な領域が大きいほどスケールが大きい", () => {
    const s1 = calculateScale(15, 45, 9.8, 400, 200);
    const s2 = calculateScale(15, 45, 9.8, 800, 400);
    expect(s2).toBeGreaterThan(s1);
  });
});
