// init.js は初期処理専用のファイルです。

import { BicpemaCanvasController } from "./class.js";
import { state, resetSimulation, TRAJECTORY_INTERVAL } from "./state.js";
import {
  onLaunchClick,
  onResetClick,
  onVelocityChange,
  onAngleChange,
  onGravityChange,
} from "./elementFunction.js";

/** フレームレート */
export const FPS = 30;
/**
 * アニメーション再生時間 (s)。
 * 物理的な滞空時間に関わらず、常にこの秒数でアニメーションが完了する。
 * これにより初速が大きくても小さくても画面上の球速が均一になる。
 */
export const ANIM_DURATION_S = 4.0;
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
 * state.time は物理時刻 (s)。アニメーションが常に ANIM_DURATION_S 秒で
 * 完了するよう、1フレームあたりの時間増分を flightTime に比例させる。
 * これにより初速が変わっても画面上の球速が一定になる。
 */
export function updatePhysics() {
  if (!state.isRunning) return;

  // 1フレームで進む物理時刻: 全飛行時間を ANIM_DURATION_S 秒に正規化
  const dt = state.flightTime / (FPS * ANIM_DURATION_S);
  state.time += dt;

  // 滞空時間を超えたら着地
  if (state.time >= state.flightTime) {
    state.time = state.flightTime;
    state.isRunning = false;
    state.isLanded = true;
    state.shownMarkerCount = state.trajectoryMarkers.length;
    return;
  }

  // 表示すべきマーカー数を更新（TRAJECTORY_INTERVAL ごとに1つ増加）
  const elapsed = Math.floor(state.time / TRAJECTORY_INTERVAL);
  if (elapsed > state.shownMarkerCount) {
    state.shownMarkerCount = elapsed;
  }
}
