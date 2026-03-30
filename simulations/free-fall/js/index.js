// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import { settingInit, elementSelectInit, elementPositionInit, valueInit, updatePhysics, canvasController } from "./init.js";
import { state } from "./state.js";
import { ballCanvasY, GROUND_TOP_Y, BALL_RADIUS_PX } from "./logic.js";

const BALL_X = 500;
const GROUND_H = 20;
const GROUND_X = 50;
const GROUND_W = 900;

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
  background(0);

  // 物理演算の更新
  updatePhysics();

  // 地面を描画（灰色）
  push();
  fill(128, 128, 128);
  noStroke();
  rectMode(CORNER);
  rect(GROUND_X, GROUND_TOP_Y, GROUND_W, GROUND_H);
  pop();

  // ボールを描画（黄色）
  const by = ballCanvasY(state.ballHeight);
  push();
  fill(255, 220, 0);
  noStroke();
  circle(BALL_X, by, BALL_RADIUS_PX * 2);
  pop();

  // 高さの表示
  push();
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(20);
  textFont("Noto Sans CJK JP, Noto Sans JP, Meiryo, sans-serif");
  text("高さ: " + nf(state.ballHeight, 1, 1) + " m", 60, 20);
  textAlign(CENTER, CENTER);
  pop();
};

// windowResized関数
// デバイスの画面サイズが変わった際に呼び出される。
window.windowResized = function () {
  canvasController.resizeScreen();
};
