// logic.js は物理計算の純粋関数を管理するファイルです。
// p5.js に依存せず、単体テストが可能な純粋な数学関数を提供します。

/** 重力加速度 (m/s²) */
export const GRAVITY = 9.8;

/** 1メートル = ロジカルピクセル数 */
export const SCALE_PX_PER_M = 4.0;

/** 地面の上端 Y 座標（ロジカルpx） */
export const GROUND_TOP_Y = 490;

/** ボールの半径（ロジカルpx） */
export const BALL_RADIUS_PX = 30;

/**
 * 1フレーム分の自由落下物理演算を実行する。
 * @param {number} height 現在の高さ（地面からボールの底面まで, m）
 * @param {number} velocity 現在の速度 (m/s, 下方向が正)
 * @param {number} dt 時間ステップ (s)
 * @param {number} restitution 反発係数 (0-1)
 * @returns {{height: number, velocity: number, bounced: boolean}}
 */
export function updateFreeFall(height, velocity, dt, restitution) {
  const newVelocity = velocity + GRAVITY * dt;
  const newHeight = height - newVelocity * dt;

  if (newHeight <= 0) {
    const bouncedVelocity = -restitution * newVelocity;
    return { height: 0, velocity: bouncedVelocity, bounced: true };
  }

  return { height: newHeight, velocity: newVelocity, bounced: false };
}

/**
 * 高さ（m）からボール中心のキャンバスY座標（ロジカルpx）を計算する。
 * @param {number} height 高さ（m）
 * @returns {number} Y座標（ロジカルpx）
 */
export function ballCanvasY(height) {
  return GROUND_TOP_Y - BALL_RADIUS_PX - height * SCALE_PX_PER_M;
}
