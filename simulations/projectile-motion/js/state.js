// state.js はシミュレーションの共有可変状態を管理するファイルです。

/** 発射点の論理X座標 */
export const LAUNCH_X_LOGICAL = 80;
/** 地面の論理Y座標 */
export const GROUND_Y_LOGICAL = 480;
/** 軌跡に使える論理幅 */
export const AVAIL_W_LOGICAL = 860;
/** 軌跡に使える論理高さ */
export const AVAIL_H_LOGICAL = 380;

/** シミュレーションの共有状態 */
export const state = {
  /** シミュレーションが実行中かどうか */
  isRunning: false,
  /** 現在の発射角度（度数） */
  currentAngle: 30,
  /** 現在の初速 (m/s) */
  currentVelocity: 15,
  /** 現在の重力加速度 (m/s²) */
  currentGravity: 9.8,

  /** 現在のシミュレーション時刻 (s) */
  time: 0,
  /** 描画スケール（論理ピクセル / メートル） */
  scale: 10,

  /** 1秒ごとの物理座標マーカー [{x, y}] */
  secondMarkers: [],
  /** 現在表示すべきマーカーの数 */
  shownMarkerCount: 0,

  /** 着地済みかどうか */
  isLanded: false,
  /** 最高の高さ (m) */
  maxHeight: 0,
  /** 水平飛距離 (m) */
  range: 0,
  /** 滞空時間 (s) */
  flightTime: 0,
};

/**
 * シミュレーションをリセットする。
 */
export function resetSimulation() {
  state.isRunning = false;
  state.time = 0;
  state.shownMarkerCount = 0;
  state.isLanded = false;
  state.maxHeight = 0;
  state.range = 0;
  state.flightTime = 0;
  state.secondMarkers = [];
  state.scale = 10;
}
