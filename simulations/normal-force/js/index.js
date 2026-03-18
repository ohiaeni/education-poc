// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import { settingInit, elementSelectInit, elementPositionInit, valueInit, updatePhysics, canvasController } from "./init.js";
import { state } from "./state.js";
import { getSlopeGeometry } from "./logic.js";
import { drawSlope, drawAngleArc, drawObject, drawForceArrows } from "./function.js";

// p5.js グローバルモード用にライフサイクル関数を window に登録する
window.setup = function () {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
};

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける。
window.draw = function () {
  scale(width / 1000);
  background(245, 245, 240);

  // 物理演算の更新
  updatePhysics();

  // 斜面ジオメトリの計算
  const geo = getSlopeGeometry(state.currentAngle);

  // 斜面を描画
  drawSlope(geo);

  // 角度の弧と数値を描画
  drawAngleArc(geo);

  // 斜面上の物体の接触点を計算
  const contactX = geo.Ax + state.sliderT * (geo.Cx - geo.Ax);
  const contactY = geo.Ay + state.sliderT * (geo.Cy - geo.Ay);

  // 物体を描画（state.lastObjCenterX / state.lastObjCenterY が更新される）
  drawObject(contactX, contactY, geo.theta);

  // 力の矢印を物体の中心から描画
  drawForceArrows(state.lastObjCenterX, state.lastObjCenterY, geo.theta, state.currentMass, state.currentGravity);
};

// windowResized関数
// デバイスの画面サイズが変わった際に呼び出される。
window.windowResized = function () {
  canvasController.resizeScreen();
};
