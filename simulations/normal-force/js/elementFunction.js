// elementFunction.jsは仮想DOMメソッド管理専用のファイルです。

import { state, resetSimulation } from "./state.js";

/**
 * スタートボタン押下時の処理
 */
export function onStartClick() {
  state.isRunning = true;
}

/**
 * ストップボタン押下時の処理
 */
export function onStopClick() {
  state.isRunning = false;
}

/**
 * 角度入力変更時の処理
 */
export function onAngleChange() {
  const val = parseFloat(document.getElementById("angleInput").value);
  if (!isNaN(val)) {
    state.currentAngle = Math.max(1, Math.min(80, val));
    // 角度変更時はシミュレーションをリセット
    resetSimulation();
  }
}

/**
 * 質量入力変更時の処理
 */
export function onMassChange() {
  const val = parseFloat(document.getElementById("massInput").value);
  if (!isNaN(val) && val > 0) {
    state.currentMass = val;
  }
}

/**
 * 重力加速度入力変更時の処理
 */
export function onGravityChange() {
  const val = parseFloat(document.getElementById("gravityInput").value);
  if (!isNaN(val) && val > 0) {
    state.currentGravity = val;
  }
}
