// init.js — 初期処理専用のファイルです。

import { BicpemaCanvasController } from "./class.js";
import { state } from "./state.js";
import {
  onFieldLinesModeChange,
  onPotentialModeChange,
  onNChange,
  onVstepChange,
  onClearMagnets,
} from "./elementFunction.js";

export const FPS = 30;
export let canvasController;

/**
 * キャンバスと基本設定を初期化する。
 * pixelDensity(1) で HiDPI 補正を無効化し、座標を 1:1 に保つ。
 */
export function settingInit() {
  pixelDensity(1);
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();

  // 右クリックのコンテキストメニューを抑制
  const cnv = document.querySelector("#p5Canvas canvas");
  if (cnv) {
    cnv.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  frameRate(FPS);
  textAlign(CENTER, CENTER);

  // オフスクリーンバッファを生成（FIELD_SCALE 間引き）
  _createFieldBuffer();
}

/**
 * DOM 要素の参照を取得する（このシミュレーションでは不要）。
 */
export function elementSelectInit() {}

/**
 * DOM のイベントリスナーを登録する。
 */
export function elementPositionInit() {
  const fieldLineCheckbox = document.getElementById("fieldLineCheckbox");
  if (fieldLineCheckbox) {
    fieldLineCheckbox.addEventListener("change", (e) =>
      onFieldLinesModeChange(e.target.checked),
    );
  }

  const potentialCheckbox = document.getElementById("potentialCheckbox");
  if (potentialCheckbox) {
    potentialCheckbox.addEventListener("change", (e) =>
      onPotentialModeChange(e.target.checked),
    );
  }

  const nSlider = document.getElementById("nSlider");
  const nValue = document.getElementById("nValue");
  if (nSlider) {
    nSlider.addEventListener("input", (e) => {
      nValue.textContent = e.target.value;
      onNChange(e.target.value);
    });
  }

  const vstepSlider = document.getElementById("vstepSlider");
  const vstepValue = document.getElementById("vstepValue");
  if (vstepSlider) {
    vstepSlider.addEventListener("input", (e) => {
      vstepValue.textContent = e.target.value;
      onVstepChange(e.target.value);
    });
  }

  const clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", onClearMagnets);
  }
}

/**
 * 初期値を設定する（state.js の既定値で十分）。
 */
export function valueInit() {}

/**
 * キャンバスリサイズ後にフィールドバッファを再生成する。
 */
export function recreateFieldBuffer() {
  _createFieldBuffer();
}

/** @private */
function _createFieldBuffer() {
  if (state.fieldBuffer) {
    state.fieldBuffer.remove();
  }
  const bw = Math.max(1, Math.floor(width / state.FIELD_SCALE));
  const bh = Math.max(1, Math.floor(height / state.FIELD_SCALE));
  state.fieldBuffer = createGraphics(bw, bh);
  state.fieldBuffer.pixelDensity(1);
  state.fieldDirty = true;
}
