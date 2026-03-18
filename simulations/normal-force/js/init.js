// init.jsは初期処理専用のファイルです。

import { BicpemaCanvasController } from "./class.js";
import { state, resetSimulation } from "./state.js";
import { onStartClick, onStopClick, onAngleChange, onMassChange, onGravityChange } from "./elementFunction.js";
import { updatePhysicsStep } from "./logic.js";

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
 * このシミュレーションでは DOM 要素の選択は elementPositionInit 内で直接行うため、ここでは何もしない。
 */
export function elementSelectInit() {}

/**
 * elementPositionInit関数
 * DOMイベントを登録する。
 */
export function elementPositionInit() {
  document.getElementById("startBtn").addEventListener("click", onStartClick);
  document.getElementById("stopBtn").addEventListener("click", onStopClick);
  document.getElementById("angleInput").addEventListener("change", onAngleChange);
  document.getElementById("massInput").addEventListener("change", onMassChange);
  document.getElementById("gravityInput").addEventListener("change", onGravityChange);
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
 * 実装は logic.js の updatePhysicsStep() に委譲する。
 */
export function updatePhysics() {
  if (!state.isRunning) return;

  const dt = 1 / FPS;
  const result = updatePhysicsStep(
    state.objVelocity,
    state.sliderT,
    dt,
    state.currentGravity,
    state.currentAngle
  );
  state.objVelocity = result.velocity;
  state.sliderT = result.sliderT;

  if (state.sliderT >= 1) {
    // 下端に到達したらリセット
    resetSimulation();
  }
}
