// function.js — p5.js キャンバスへの描画関数

import { state } from "./state.js";

/**
 * 棒磁石 1 本を描画する。
 * 中心を原点として回転させた後、N 極（赤）と S 極（青）の矩形を描く。
 *
 * @param {import('./class.js').Magnet} m
 */
export function drawMagnet(m) {
  const { R, HANKEI } = state;
  const L = R + HANKEI; // 各極の矩形の長さ
  const angle = Math.atan2(m.sinA, m.cosA);

  push();
  translate(m.x, m.y);
  rotate(angle);
  noStroke();

  // S 極（青）: x = -L〜0, y = -HANKEI〜HANKEI
  fill(60, 100, 230);
  rect(-L, -HANKEI, L, HANKEI * 2);

  // N 極（赤）: x = 0〜L, y = -HANKEI〜HANKEI
  fill(220, 50, 50);
  rect(0, -HANKEI, L, HANKEI * 2);

  // 中央の境界線
  stroke(0, 0, 0, 150);
  strokeWeight(1.5);
  line(0, -HANKEI, 0, HANKEI);

  // 極のラベル
  noStroke();
  fill(255, 255, 255, 220);
  textAlign(CENTER, CENTER);
  textSize(HANKEI * 1.1);
  text("N", L / 2, 0);
  text("S", -L / 2, 0);

  pop();
}

/**
 * state.magnets の全磁石を描画する。
 */
export function drawAllMagnets() {
  for (const m of state.magnets) {
    drawMagnet(m);
  }
}

/**
 * フィールドバッファ (p5.Graphics) をキャンバス全体に拡大描画する。
 */
export function drawFieldBuffer() {
  if (state.fieldBuffer) {
    image(state.fieldBuffer, 0, 0, width, height);
  }
}
