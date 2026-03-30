// state.js はシミュレーションの共有可変状態を管理するファイルです。

/** シミュレーションの共有状態 */
export const state = {
  /** シミュレーションが実行中かどうか */
  isRunning: false,
  /** 反発係数 (0-1) */
  currentRestitution: 0.8,
  /** 初期高さ (m) */
  initialHeight: 50,
  /** 現在のボールの高さ（地面からボール底面まで, m） */
  ballHeight: 50,
  /** 現在の速度 (m/s、下方向が正) */
  ballVelocity: 0,
};

/**
 * シミュレーションをリセットする。
 */
export function resetSimulation() {
  state.ballHeight = state.initialHeight;
  state.ballVelocity = 0;
}
