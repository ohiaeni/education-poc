// state.js — シミュレーションの共有可変状態を管理するファイルです。

/** シミュレーションの共有状態 */
export const state = {
  /** 磁石オブジェクトの配列 */
  magnets: [],
  /** 磁石の半長さ (px) — N/S 極の位置を決める */
  R: 30,
  /** 磁石の半幅 / インタラクション判定半径 (px) */
  HANKEI: 10,
  /** 磁力線の本数密度 (1〜8) */
  N: 5,
  /** 等磁位線のステップ間隔 (1〜8) */
  Vstep: 4,
  /** 磁力線表示フラグ */
  showFieldLines: false,
  /** 等磁位線表示フラグ */
  showPotential: false,
  /**
   * ドラッグ対象 { type: 'body' | 'npole', index: number } | null
   * body  → 磁石中心を移動
   * npole → N 極先端を起点に回転
   */
  dragTarget: null,
  /** フィールドバッファの再計算が必要か */
  fieldDirty: true,
  /** オフスクリーン描画バッファ (p5.Graphics) */
  fieldBuffer: null,
  /** フィールド計算時の間引き倍率 (2 = 縦横 1/2 解像度で計算) */
  FIELD_SCALE: 2,
};

/** 磁石を全削除してリセットする */
export function resetMagnets() {
  state.magnets = [];
  state.dragTarget = null;
  state.fieldDirty = true;
}
