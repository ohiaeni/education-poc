// logic.js は物理計算の純粋関数を管理するファイルです。
// p5.js に依存せず、単体テストが可能な純粋な数学関数を提供します。

/**
 * 斜方投射の位置を計算する（y は上向き正）。
 * @param {number} v0 初速 (m/s)
 * @param {number} angleDeg 発射角度（度数）
 * @param {number} t 時刻 (s)
 * @param {number} g 重力加速度 (m/s²)
 * @returns {{x: number, y: number}} 物理座標
 */
export function calculatePosition(v0, angleDeg, t, g = 9.8) {
  const theta = (angleDeg * Math.PI) / 180;
  const v0x = v0 * Math.cos(theta);
  const v0y = v0 * Math.sin(theta);
  return {
    x: v0x * t,
    y: v0y * t - 0.5 * g * t * t,
  };
}

/**
 * 滞空時間を計算する。T = 2 * v0 * sinθ / g
 * @param {number} v0 初速 (m/s)
 * @param {number} angleDeg 発射角度（度数）
 * @param {number} g 重力加速度 (m/s²)
 * @returns {number} 滞空時間 (s)
 */
export function calculateFlightTime(v0, angleDeg, g = 9.8) {
  const theta = (angleDeg * Math.PI) / 180;
  const v0y = v0 * Math.sin(theta);
  if (v0y <= 0) return 0;
  return (2 * v0y) / g;
}

/**
 * 最高の高さを計算する。H = v0y² / (2g)
 * @param {number} v0 初速 (m/s)
 * @param {number} angleDeg 発射角度（度数）
 * @param {number} g 重力加速度 (m/s²)
 * @returns {number} 最高の高さ (m)
 */
export function calculateMaxHeight(v0, angleDeg, g = 9.8) {
  const theta = (angleDeg * Math.PI) / 180;
  const v0y = v0 * Math.sin(theta);
  return (v0y * v0y) / (2 * g);
}

/**
 * 水平飛距離を計算する。R = v0² * sin(2θ) / g
 * @param {number} v0 初速 (m/s)
 * @param {number} angleDeg 発射角度（度数）
 * @param {number} g 重力加速度 (m/s²)
 * @returns {number} 水平飛距離 (m)
 */
export function calculateRange(v0, angleDeg, g = 9.8) {
  const theta = (angleDeg * Math.PI) / 180;
  return (v0 * v0 * Math.sin(2 * theta)) / g;
}

/**
 * 指定した時間間隔ごとの軌跡マーカー位置を計算して返す。
 * @param {number} v0 初速 (m/s)
 * @param {number} angleDeg 発射角度（度数）
 * @param {number} g 重力加速度 (m/s²)
 * @param {number} interval 時間間隔 (s)
 * @returns {Array<{x: number, y: number}>} 各間隔時刻での位置
 */
export function getIntervalMarkers(v0, angleDeg, g = 9.8, interval = 1) {
  const T = calculateFlightTime(v0, angleDeg, g);
  const markers = [];
  const count = Math.floor(T / interval);
  for (let i = 1; i <= count; i++) {
    markers.push(calculatePosition(v0, angleDeg, i * interval, g));
  }
  return markers;
}

/**
 * 1秒ごとの軌跡マーカー位置を計算して返す。
 * @param {number} v0 初速 (m/s)
 * @param {number} angleDeg 発射角度（度数）
 * @param {number} g 重力加速度 (m/s²)
 * @returns {Array<{x: number, y: number}>} 各整数秒での位置
 */
export function getSecondMarkers(v0, angleDeg, g = 9.8) {
  return getIntervalMarkers(v0, angleDeg, g, 1);
}

/**
 * 軌跡が論理キャンバスに収まるよう描画スケールを計算する。
 * @param {number} v0 初速 (m/s)
 * @param {number} angleDeg 発射角度（度数）
 * @param {number} g 重力加速度 (m/s²)
 * @param {number} availWidth 利用可能な論理幅 (px)
 * @param {number} availHeight 利用可能な論理高さ (px)
 * @returns {number} 描画スケール（論理ピクセル / メートル）
 */
export function calculateScale(v0, angleDeg, g, availWidth, availHeight) {
  const R = calculateRange(v0, angleDeg, g);
  const H = calculateMaxHeight(v0, angleDeg, g);
  if (R <= 0 || H <= 0) return 10;
  const sx = availWidth / R;
  const sy = availHeight / H;
  return Math.min(sx, sy) * 0.85;
}
