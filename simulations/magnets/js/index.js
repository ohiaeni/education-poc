// index.js — メインのエントリーポイント

import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
  canvasController,
  recreateFieldBuffer,
} from "./init.js";
import { state } from "./state.js";
import { recomputeField } from "./logic.js";
import { drawFieldBuffer, drawAllMagnets } from "./function.js";
import {
  onMousePressed,
  onMouseReleased,
  onMouseDragged,
} from "./elementFunction.js";

// ----- p5.js ライフサイクル -----

window.setup = function () {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
};

window.draw = function () {
  background(255);

  // ドラッグ中でなく、かつ再計算フラグが立っている場合は計算を実行する
  if (state.fieldDirty && !state.dragTarget) {
    recomputeField();
  }

  // フィールドバッファをキャンバス全体に描画
  drawFieldBuffer();

  // 磁石を上に重ねて描画
  drawAllMagnets();
};

window.windowResized = function () {
  canvasController.resizeScreen();
  recreateFieldBuffer();
};

// ----- マウスイベント -----

window.mousePressed = function () {
  if (mouseButton === RIGHT) {
    onMousePressed(mouseX, mouseY, true);
    return false; // コンテキストメニューを抑制
  }
  onMousePressed(mouseX, mouseY, false);
};

window.mouseReleased = function () {
  onMouseReleased();
};

window.mouseDragged = function () {
  onMouseDragged(mouseX, mouseY);
};
