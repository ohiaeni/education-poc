// init.jsは初期処理専用のファイルです。

import { BicpemaCanvasController } from "./class.js";
import { state, resetSimulation } from "./state.js";
import { onStartClick, onStopClick, onResetClick, onRestitutionChange, onHeightChange } from "./elementFunction.js";
import { updateFreeFall } from "./logic.js";

export const FPS = 30;
export let canvasController;

/**
 * settingInit関数
 * シミュレーションそのものの設定を行う。
 */
export function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textSize(16);
  textFont("Noto Sans CJK JP, Noto Sans JP, Meiryo, sans-serif");
}

/**
 * elementSelectInit関数
 * 仮想DOMを読み込むための関数。
 */
export function elementSelectInit() {}

/**
 * elementPositionInit関数
 * DOMイベントを登録する。
 */
export function elementPositionInit() {
  document.getElementById("startBtn").addEventListener("click", onStartClick);
  document.getElementById("stopBtn").addEventListener("click", onStopClick);
  document.getElementById("resetBtn").addEventListener("click", onResetClick);
  document.getElementById("restitutionInput").addEventListener("change", onRestitutionChange);
  document.getElementById("heightInput").addEventListener("change", onHeightChange);
}

/**
 * valueInit関数
 * 初期値を設定する。
 */
export function valueInit() {
  resetSimulation();
}

/**
 * フレームごとに物理演算を更新する。
 */
export function updatePhysics() {
  if (!state.isRunning) return;

  const dt = 1 / FPS;
  const result = updateFreeFall(
    state.ballHeight,
    state.ballVelocity,
    dt,
    state.currentRestitution
  );
  state.ballHeight = result.height;
  state.ballVelocity = result.velocity;

  // 反発後の速度が十分小さければ停止
  if (result.bounced && Math.abs(result.velocity) < 0.5) {
    state.ballHeight = 0;
    state.ballVelocity = 0;
    state.isRunning = false;
  }
}
