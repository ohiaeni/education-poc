// elementFunction.js — DOM イベント / ユーザー操作のハンドラー

import { state, resetMagnets } from "./state.js";
import { Magnet } from "./class.js";

/**
 * マウス押下時の処理。
 *
 * 右クリック: 中心が近い磁石を削除する。
 * 左クリック: 近い磁石の中心 → body ドラッグ開始
 *             近い磁石の N 極 → npole ドラッグ開始（回転）
 *             何もない場所    → 新しい磁石を追加
 *
 * @param {number}  x       キャンバス座標 X
 * @param {number}  y       キャンバス座標 Y
 * @param {boolean} isRight 右クリックかどうか
 */
export function onMousePressed(x, y, isRight) {
  const { magnets, R, HANKEI } = state;
  const h2 = HANKEI * HANKEI;

  if (isRight) {
    // 中心に最も近い磁石を削除
    for (let i = 0; i < magnets.length; i++) {
      const m = magnets[i];
      if ((m.x - x) ** 2 + (m.y - y) ** 2 <= h2) {
        magnets.splice(i, 1);
        state.fieldDirty = true;
        return;
      }
    }
    return;
  }

  // 左クリック: ドラッグ対象を探す
  for (let i = 0; i < magnets.length; i++) {
    const m = magnets[i];
    // 中心クリック → 本体ドラッグ
    if ((m.x - x) ** 2 + (m.y - y) ** 2 <= h2) {
      state.dragTarget = { type: "body", index: i };
      return;
    }
    // N 極先端クリック → 回転ドラッグ
    const ndx = m.nxAt(R) - x;
    const ndy = m.nyAt(R) - y;
    if (ndx * ndx + ndy * ndy <= h2) {
      state.dragTarget = { type: "npole", index: i };
      return;
    }
  }

  // 何もない場所 → 新規追加
  magnets.push(new Magnet(x, y));
  state.fieldDirty = true;
}

/**
 * マウスリリース時の処理。
 * ドラッグを終了しフィールドの再計算をスケジュールする。
 */
export function onMouseReleased() {
  if (state.dragTarget !== null) {
    state.dragTarget = null;
    state.fieldDirty = true;
  }
}

/**
 * マウスドラッグ時の処理。
 *
 * body ドラッグ: キャンバス内にクランプしながら移動
 * npole ドラッグ: N 極の向きに合わせて磁石を回転
 *
 * @param {number} x キャンバス座標 X
 * @param {number} y キャンバス座標 Y
 */
export function onMouseDragged(x, y) {
  const { dragTarget, magnets, HANKEI } = state;
  if (!dragTarget) return;

  const m = magnets[dragTarget.index];
  if (!m) return;

  if (dragTarget.type === "body") {
    m.setPosition(x, y, width, height, HANKEI);
  } else {
    m.setAngleTo(x, y);
  }
}

/** 磁力線表示を切り替える */
export function onFieldLinesModeChange(checked) {
  state.showFieldLines = checked;
  state.fieldDirty = true;
}

/** 等磁位線表示を切り替える */
export function onPotentialModeChange(checked) {
  state.showPotential = checked;
  state.fieldDirty = true;
}

/** 磁力線本数を更新する */
export function onNChange(value) {
  state.N = parseInt(value, 10);
  state.fieldDirty = true;
}

/** 等磁位線間隔を更新する */
export function onVstepChange(value) {
  state.Vstep = parseInt(value, 10);
  state.fieldDirty = true;
}

/** 全磁石を削除する */
export function onClearMagnets() {
  resetMagnets();
}
