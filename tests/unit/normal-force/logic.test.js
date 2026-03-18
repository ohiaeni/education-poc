import { describe, it, expect } from "vitest";
import {
  getSlopeGeometry,
  calculateNormalForce,
  calculateSlopeForce,
  updatePhysicsStep,
  SLOPE_PHYS_LEN,
} from "../../../simulations/normal-force/js/logic.js";

// テスト内の数値比較に使う許容誤差
const EPS = 1e-9;

describe("getSlopeGeometry", () => {
  it("角度30°のときジオメトリが正しく計算される", () => {
    const geo = getSlopeGeometry(30);
    const theta = (30 * Math.PI) / 180;

    expect(geo.theta).toBeCloseTo(theta, 10);
    expect(geo.Cx).toBe(810);
    expect(geo.Cy).toBe(460);
    expect(geo.slopeLen).toBe(560);
    expect(geo.Ax).toBeCloseTo(810 - 560 * Math.cos(theta), 5);
    expect(geo.Ay).toBeCloseTo(460 - 560 * Math.sin(theta), 5);
    // B は A の真下 (同じ X, Cy と同じ Y)
    expect(geo.Bx).toBeCloseTo(geo.Ax, 5);
    expect(geo.By).toBe(460);
  });

  it("角度45°のときAx=Ay + offset になる（等辺三角形）", () => {
    const geo = getSlopeGeometry(45);
    // cos45 == sin45 なので Ax から Cx への水平距離 = Ay から Cy への垂直距離
    expect(Math.abs(geo.Cx - geo.Ax)).toBeCloseTo(Math.abs(geo.Cy - geo.Ay), 5);
  });

  it("角度が下限（1°）を下回るときは1°にクランプされる", () => {
    const geo = getSlopeGeometry(0);
    expect(geo.theta).toBeCloseTo((1 * Math.PI) / 180, 10);
  });

  it("角度が上限（80°）を超えるときは80°にクランプされる", () => {
    const geo = getSlopeGeometry(90);
    expect(geo.theta).toBeCloseTo((80 * Math.PI) / 180, 10);
  });
});

describe("calculateNormalForce", () => {
  it("水平面（θ=0°）では垂直抗力 = mg", () => {
    const N = calculateNormalForce(1, 9.8, 0);
    expect(N).toBeCloseTo(9.8, 5);
  });

  it("垂直面（θ=90°）では垂直抗力 ≈ 0", () => {
    const N = calculateNormalForce(1, 9.8, 90);
    expect(Math.abs(N)).toBeLessThan(EPS * 1e5);
  });

  it("θ=30°: N = mg cos30° = mg * √3/2", () => {
    const mass = 2;
    const g = 9.8;
    const N = calculateNormalForce(mass, g, 30);
    expect(N).toBeCloseTo(mass * g * Math.cos((30 * Math.PI) / 180), 5);
  });

  it("質量と重力加速度に比例する", () => {
    const N1 = calculateNormalForce(1, 9.8, 30);
    const N2 = calculateNormalForce(2, 9.8, 30);
    const N3 = calculateNormalForce(1, 19.6, 30);
    expect(N2).toBeCloseTo(N1 * 2, 5);
    expect(N3).toBeCloseTo(N1 * 2, 5);
  });
});

describe("calculateSlopeForce", () => {
  it("水平面（θ=0°）では斜面成分 ≈ 0", () => {
    const F = calculateSlopeForce(1, 9.8, 0);
    expect(Math.abs(F)).toBeLessThan(EPS * 1e5);
  });

  it("垂直面（θ=90°）では斜面成分 = mg", () => {
    const F = calculateSlopeForce(1, 9.8, 90);
    expect(F).toBeCloseTo(9.8, 5);
  });

  it("θ=30°: F = mg sin30° = mg * 0.5", () => {
    const mass = 3;
    const g = 9.8;
    const F = calculateSlopeForce(mass, g, 30);
    expect(F).toBeCloseTo(mass * g * 0.5, 5);
  });

  it("垂直抗力と斜面成分の二乗和の平方根 = mg（ピタゴラス）", () => {
    const mass = 2;
    const g = 9.8;
    const angleDeg = 45;
    const N = calculateNormalForce(mass, g, angleDeg);
    const F = calculateSlopeForce(mass, g, angleDeg);
    const resultant = Math.sqrt(N * N + F * F);
    expect(resultant).toBeCloseTo(mass * g, 5);
  });
});

describe("updatePhysicsStep", () => {
  it("初期状態（velocity=0, sliderT=0）から1ステップ後に速度が増加する", () => {
    const result = updatePhysicsStep(0, 0, 1 / 30, 9.8, 30);
    expect(result.velocity).toBeGreaterThan(0);
    expect(result.sliderT).toBeGreaterThan(0);
  });

  it("θ=0°（水平面）では加速度=0 なので速度・位置が変わらない", () => {
    const result = updatePhysicsStep(0, 0, 1 / 30, 9.8, 0);
    expect(result.velocity).toBeCloseTo(0, 10);
    expect(result.sliderT).toBeCloseTo(0, 10);
  });

  it("加速度は g sinθ に等しい", () => {
    const dt = 1 / 30;
    const g = 9.8;
    const angleDeg = 45;
    const result = updatePhysicsStep(0, 0, dt, g, angleDeg);
    const expectedA = g * Math.sin((angleDeg * Math.PI) / 180);
    const expectedVelocity = expectedA * dt;
    expect(result.velocity).toBeCloseTo(expectedVelocity, 10);
  });

  it("重力が大きいほど速く加速する", () => {
    const dt = 1 / 30;
    const angleDeg = 30;
    const r1 = updatePhysicsStep(0, 0, dt, 9.8, angleDeg);
    const r2 = updatePhysicsStep(0, 0, dt, 20, angleDeg);
    expect(r2.velocity).toBeGreaterThan(r1.velocity);
  });

  it("SLOPE_PHYS_LEN は 8 m である", () => {
    expect(SLOPE_PHYS_LEN).toBe(8);
  });
});
