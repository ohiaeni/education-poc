// elementFunction.js は仮想DOMメソッド管理専用のファイルです。

import { state, resetSimulation, AVAIL_W_LOGICAL, AVAIL_H_LOGICAL } from "./state.js";
import {
  calculateFlightTime,
  calculateMaxHeight,
  calculateRange,
  calculateScale,
  getSecondMarkers,
} from "./logic.js";

/**
 * 投射ボタン押下時の処理。
 * すでに実行中または着地済みの場合はリセット後に再投射する。
 */
export function onLaunchClick() {
  resetSimulation();
  launchProjectile();
}

/**
 * リセットボタン押下時の処理。
 */
export function onResetClick() {
  resetSimulation();
}

/**
 * 初速入力変更時の処理。
 */
export function onVelocityChange() {
  const val = parseFloat(document.getElementById("velocityInput").value);
  if (!isNaN(val) && val > 0) {
    state.currentVelocity = Math.max(1, Math.min(50, val));
    resetSimulation();
  }
}

/**
 * 角度入力変更時の処理。
 */
export function onAngleChange() {
  const val = parseFloat(document.getElementById("angleInput").value);
  if (!isNaN(val)) {
    state.currentAngle = Math.max(1, Math.min(89, val));
    resetSimulation();
  }
}

/**
 * 重力加速度入力変更時の処理。
 */
export function onGravityChange() {
  const val = parseFloat(document.getElementById("gravityInput").value);
  if (!isNaN(val) && val > 0) {
    state.currentGravity = val;
    resetSimulation();
  }
}

/**
 * 現在の設定で投射を開始する。
 */
function launchProjectile() {
  const v0 = state.currentVelocity;
  const angle = state.currentAngle;
  const g = state.currentGravity;

  state.scale = calculateScale(v0, angle, g, AVAIL_W_LOGICAL, AVAIL_H_LOGICAL);
  state.flightTime = calculateFlightTime(v0, angle, g);
  state.maxHeight = calculateMaxHeight(v0, angle, g);
  state.range = calculateRange(v0, angle, g);
  state.secondMarkers = getSecondMarkers(v0, angle, g);
  state.shownMarkerCount = 0;
  state.time = 0;
  state.isRunning = true;
}
