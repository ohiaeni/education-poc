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
 * リセットボタン押下時の処理
 */
export function onResetClick() {
  state.isRunning = false;
  resetSimulation();
}

/**
 * 反発係数入力変更時の処理
 */
export function onRestitutionChange() {
  const val = parseFloat(document.getElementById("restitutionInput").value);
  if (!isNaN(val)) {
    state.currentRestitution = Math.max(0, Math.min(1, val));
    resetSimulation();
  }
}

/**
 * 初期高さ入力変更時の処理
 */
export function onHeightChange() {
  const val = parseFloat(document.getElementById("heightInput").value);
  if (!isNaN(val)) {
    state.initialHeight = Math.max(10, Math.min(100, val));
    resetSimulation();
  }
}
