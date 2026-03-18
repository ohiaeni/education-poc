// state.js はシミュレーションの共有可変状態を管理するファイルです。

/** シミュレーションの共有状態 */
export const state = {
  /** シミュレーションが実行中かどうか */
  isRunning: false,
  /** 現在の斜面角度（度数） */
  currentAngle: 30,
  /** 現在の質量 (kg) */
  currentMass: 1.0,
  /** 現在の重力加速度 (m/s²) */
  currentGravity: 9.8,
  /** スロープ上の位置（0=上端, 1=下端） */
  sliderT: 0,
  /** 速度 (物理 m/s) */
  objVelocity: 0,
  /** drawObject が更新する物体の中心 X 座標 */
  lastObjCenterX: 0,
  /** drawObject が更新する物体の中心 Y 座標 */
  lastObjCenterY: 0,
};

/**
 * シミュレーションをリセットする。
 */
export function resetSimulation() {
  state.sliderT = 0;
  state.objVelocity = 0;
}
