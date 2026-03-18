// function.js は p5.js を使った描画関数を管理するファイルです。

import { state, LAUNCH_X_LOGICAL, GROUND_Y_LOGICAL } from "./state.js";
import { calculatePosition } from "./logic.js";

/** 球の半径（論理px） */
const BALL_RADIUS = 20;
/** 軌跡マーカーの半径（論理px） */
const MARKER_RADIUS = 20;

/**
 * 地面と空のグラデーション背景を描画する。
 */
export function drawBackground() {
  // 空
  push();
  noStroke();
  fill(235, 245, 255);
  rect(0, 0, 1000, GROUND_Y_LOGICAL);
  // 地面
  fill(100, 130, 80);
  rect(0, GROUND_Y_LOGICAL, 1000, 562 - GROUND_Y_LOGICAL);
  // 地面の境界線
  stroke(60, 80, 40);
  strokeWeight(2);
  line(0, GROUND_Y_LOGICAL, 1000, GROUND_Y_LOGICAL);
  pop();
}

/**
 * 発射点での角度矢印を描画する。
 * @param {number} angleDeg 角度（度数）
 * @param {number} arrowLen 矢印の長さ（論理px）
 */
export function drawAngleArrow(angleDeg, arrowLen = 80) {
  const theta = (angleDeg * Math.PI) / 180;
  const ax = LAUNCH_X_LOGICAL;
  const ay = GROUND_Y_LOGICAL;
  // p5 の y 軸は下向き正なので上方向は負
  const ex = ax + arrowLen * Math.cos(theta);
  const ey = ay - arrowLen * Math.sin(theta);

  push();
  stroke(40, 40, 200);
  fill(40, 40, 200);
  strokeWeight(2);
  drawArrow(ax, ay, ex, ey, 10);
  pop();

  // 角度テキスト
  const labelX = ax + (arrowLen * 0.55) * Math.cos(theta) + 14;
  const labelY = ay - (arrowLen * 0.55) * Math.sin(theta) + 8;
  push();
  fill(40, 40, 200);
  noStroke();
  textSize(18);
  textAlign(LEFT, CENTER);
  text(angleDeg + "°", labelX, labelY);
  pop();
}

/**
 * 矢印を描画する。
 * @param {number} x1 始点X
 * @param {number} y1 始点Y
 * @param {number} x2 終点X
 * @param {number} y2 終点Y
 * @param {number} headSize 矢頭サイズ（論理px）
 */
export function drawArrow(x1, y1, x2, y2, headSize = 12) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = sqrt(dx * dx + dy * dy);
  if (len < 1) return;

  line(x1, y1, x2, y2);

  const angle = atan2(dy, dx);
  push();
  translate(x2, y2);
  rotate(angle);
  noStroke();
  triangle(0, 0, -headSize, -headSize * 0.4, -headSize, headSize * 0.4);
  pop();
}

/**
 * 球を描画する。
 * - 未発射時: 発射点（LAUNCH_X_LOGICAL, GROUND_Y_LOGICAL）
 * - 飛行中: 現在の物理座標
 * - 着地後: 着地点（LAUNCH_X_LOGICAL + range * scale, GROUND_Y_LOGICAL）
 */
export function drawBall() {
  let cx, cy;
  if (state.isLanded) {
    // 着地位置に球を表示し続ける
    cx = LAUNCH_X_LOGICAL + state.range * state.scale;
    cy = GROUND_Y_LOGICAL;
  } else if (state.isRunning) {
    // 現在の物理座標に表示
    const { x, y } = calculatePosition(
      state.currentVelocity,
      state.currentAngle,
      state.time,
      state.currentGravity
    );
    cx = LAUNCH_X_LOGICAL + x * state.scale;
    cy = GROUND_Y_LOGICAL - y * state.scale;
  } else {
    // 発射前は発射点に表示
    cx = LAUNCH_X_LOGICAL;
    cy = GROUND_Y_LOGICAL;
  }

  push();
  fill(255, 255, 255);
  stroke(30, 30, 30);
  strokeWeight(2);
  circle(cx, cy, BALL_RADIUS * 2);
  pop();
}

/**
 * 軌跡マーカーを破線の円で描画する。
 * state.trajectoryMarkers の先頭 shownMarkerCount 個を描画する。
 */
export function drawTrajectoryMarkers() {
  const markers = state.trajectoryMarkers.slice(0, state.shownMarkerCount);

  for (let i = 0; i < markers.length; i++) {
    const { x, y } = markers[i];
    const cx = LAUNCH_X_LOGICAL + x * state.scale;
    const cy = GROUND_Y_LOGICAL - y * state.scale;

    push();
    drawingContext.setLineDash([6, 4]);
    noFill();
    stroke(80, 80, 80);
    strokeWeight(1.5);
    circle(cx, cy, MARKER_RADIUS * 2);
    drawingContext.setLineDash([]);
    pop();
  }
}

/**
 * 着地後の結果（最高の高さ・飛距離）をキャンバス上に表示する。
 * @param {number} maxHeight 最高の高さ (m)
 * @param {number} range 水平飛距離 (m)
 */
export function drawResults(maxHeight, range) {
  push();
  // 背景パネル
  fill(255, 255, 255, 220);
  noStroke();
  rect(650, 30, 320, 108, 8);
  // テキスト
  fill(20, 20, 20);
  noStroke();
  textSize(17);
  textAlign(LEFT, TOP);
  text("最高の高さ:", 665, 45);
  textAlign(RIGHT, TOP);
  text(nf(maxHeight, 1, 2) + " m", 960, 45);
  textAlign(LEFT, TOP);
  text("飛距離:", 665, 82);
  textAlign(RIGHT, TOP);
  text(nf(range, 1, 2) + " m", 960, 82);
  pop();
}
