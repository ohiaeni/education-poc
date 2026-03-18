// init.js は初期処理専用のファイルです。

import { BicpemaCanvasController } from "./class.js";
import { state, resetSimulation } from "./state.js";
import {
  onLaunchClick,
  onResetClick,
  onVelocityChange,
  onAngleChange,
  onGravityChange,
} from "./elementFunction.js";

/** フレームレート */
export const FPS = 30;
export let canvasController;

/**
 * settingInit 関数
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
 * elementSelectInit 関数
 * 仮想DOMを読み込むための関数。
 */
export function elementSelectInit() {}

/**
 * elementPositionInit 関数
 * DOM イベントを登録する。
 */
export function elementPositionInit() {
  document.getElementById("launchBtn").addEventListener("click", onLaunchClick);
  document.getElementById("resetBtn").addEventListener("click", onResetClick);
  document.getElementById("velocityInput").addEventListener("change", onVelocityChange);
  document.getElementById("angleInput").addEventListener("change", onAngleChange);
  document.getElementById("gravityInput").addEventListener("change", onGravityChange);
}

/**
 * valueInit 関数
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
  state.time += dt;

  // 滞空時間を超えたら着地
  if (state.time >= state.flightTime) {
    state.time = state.flightTime;
    state.isRunning = false;
    state.isLanded = true;
    state.shownMarkerCount = state.secondMarkers.length;
    return;
  }

  // 表示すべきマーカー数を更新
  const elapsed = Math.floor(state.time);
  if (elapsed > state.shownMarkerCount) {
    state.shownMarkerCount = elapsed;
  }
}
