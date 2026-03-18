// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
  updatePhysics,
  canvasController,
} from "./init.js";
import { state } from "./state.js";
import {
  drawBackground,
  drawAngleArrow,
  drawBall,
  drawTrajectoryMarkers,
  drawResults,
} from "./function.js";

// p5.js グローバルモード用にライフサイクル関数を window に登録する

// setup 関数
// シミュレーションを実行する際に１度だけ呼び出される。
window.setup = function () {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
};

// draw 関数
// シミュレーションを実行した後、繰り返し呼び出され続ける。
window.draw = function () {
  scale(width / 1000);

  // 物理演算の更新
  updatePhysics();

  // 背景描画
  drawBackground();

  // 発射角度の矢印（常に表示）
  drawAngleArrow(state.currentAngle);

  // 軌跡マーカーを描画（飛行中・着地後）
  if (state.isRunning || state.isLanded) {
    drawTrajectoryMarkers();
  }

  // 球を常に描画（未発射時は発射点、飛行中は現在位置、着地後は着地点）
  drawBall();

  // 着地後に結果を表示
  if (state.isLanded) {
    drawResults(state.maxHeight, state.range);
  }
};

// windowResized 関数
// デバイスの画面サイズが変わった際に呼び出される。
window.windowResized = function () {
  canvasController.resizeScreen();
};
