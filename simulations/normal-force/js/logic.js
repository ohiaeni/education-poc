// logic.js は物理計算の純粋関数を管理するファイルです。
// p5.js に依存せず、単体テストが可能な純粋な数学関数を提供します。

/** 斜面の物理的な長さ (m) */
export const SLOPE_PHYS_LEN = 8;

/**
 * 斜面のジオメトリを計算して返す（ロジカル座標 1000x562 基準）。
 * @param {number} angleDeg 角度（度数）
 * @returns {{Ax: number, Ay: number, Bx: number, By: number, Cx: number, Cy: number, theta: number, slopeLen: number}}
 */
export function getSlopeGeometry(angleDeg) {
  const theta = (Math.max(1, Math.min(80, angleDeg)) * Math.PI) / 180;
  // C: 斜面の下端（右下）固定
  const Cx = 810;
  const Cy = 460;
  // 斜面の長さ（ロジカルpx）
  const slopeLen = 560;
  // A: 斜面の上端（左上）
  const Ax = Cx - slopeLen * Math.cos(theta);
  const Ay = Cy - slopeLen * Math.sin(theta);
  // B: 直角頂点（Aの真下）
  const Bx = Ax;
  const By = Cy;

  return { Ax, Ay, Bx, By, Cx, Cy, theta, slopeLen };
}

/**
 * 垂直抗力を計算する。N = mg cosθ
 * @param {number} mass 質量 (kg)
 * @param {number} gravity 重力加速度 (m/s²)
 * @param {number} angleDeg 角度（度数）
 * @returns {number} 垂直抗力 (N)
 */
export function calculateNormalForce(mass, gravity, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  return mass * gravity * Math.cos(theta);
}

/**
 * 斜面方向の重力成分を計算する。F = mg sinθ
 * @param {number} mass 質量 (kg)
 * @param {number} gravity 重力加速度 (m/s²)
 * @param {number} angleDeg 角度（度数）
 * @returns {number} 斜面方向の重力成分 (N)
 */
export function calculateSlopeForce(mass, gravity, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  return mass * gravity * Math.sin(theta);
}

/**
 * 1フレーム分の物理演算を実行する。
 * @param {number} velocity 現在の速度 (m/s)
 * @param {number} sliderT スロープ上の位置（0=上端, 1=下端）
 * @param {number} dt 時間ステップ (s)
 * @param {number} gravity 重力加速度 (m/s²)
 * @param {number} angleDeg 角度（度数）
 * @returns {{velocity: number, sliderT: number}} 更新後の状態
 */
export function updatePhysicsStep(velocity, sliderT, dt, gravity, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const a = gravity * Math.sin(theta); // 斜面に沿った加速度 (m/s²)
  const newVelocity = velocity + a * dt;
  const ds = newVelocity * dt; // このフレームの移動距離 (m)
  const newSliderT = sliderT + ds / SLOPE_PHYS_LEN;
  return { velocity: newVelocity, sliderT: newSliderT };
}
