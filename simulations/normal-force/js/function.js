// function.jsはその他のメソッド管理専用のファイルです。

/**
 * 矢印を描画する。
 * @param {number} x1 始点X
 * @param {number} y1 始点Y
 * @param {number} x2 終点X
 * @param {number} y2 終点Y
 * @param {number} headSize 矢頭サイズ（ロジカルピクセル）
 */
function drawArrow(x1, y1, x2, y2, headSize = 12) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let len = sqrt(dx * dx + dy * dy);
  if (len < 1) return;

  line(x1, y1, x2, y2);

  let angle = atan2(dy, dx);
  push();
  translate(x2, y2);
  rotate(angle);
  noStroke();
  triangle(0, 0, -headSize, -headSize * 0.4, -headSize, headSize * 0.4);
  pop();
}

/**
 * 斜面（三角形）を描画する。
 * @param {{Ax,Ay,Bx,By,Cx,Cy}} geo getSlopeGeometry の返り値
 */
function drawSlope(geo) {
  push();
  fill(255);
  stroke(0);
  strokeWeight(2);
  triangle(geo.Ax, geo.Ay, geo.Bx, geo.By, geo.Cx, geo.Cy);
  pop();
}

/**
 * 物体（直方体）を斜面上の指定位置に描画する。
 * @param {number} cx 物体の中心X（スロープ面上）
 * @param {number} cy 物体の中心Y（スロープ面上）
 * @param {number} theta 斜面の角度（ラジアン）
 */
function drawObject(cx, cy, theta) {
  const OBJ_W = 50;
  const OBJ_H = 50;
  // 法線方向（スロープ面から外へ向かう方向）: (sin θ, -cos θ)  in canvas coords
  let nx = sin(theta);
  let ny = -cos(theta);
  // 物体の中心をスロープ面からOBJ_H/2だけ法線方向に移動
  let ocx = cx + nx * OBJ_H / 2;
  let ocy = cy + ny * OBJ_H / 2;

  push();
  translate(ocx, ocy);
  rotate(theta);
  fill(220, 220, 255);
  stroke(0);
  strokeWeight(1.5);
  rectMode(CENTER);
  rect(0, 0, OBJ_W, OBJ_H);
  pop();

  // 中心座標を返すためにグローバル変数に保存（index.jsから参照）
  lastObjCenterX = ocx;
  lastObjCenterY = ocy;
}

/**
 * 力の矢印を描画する。
 * @param {number} cx 物体の中心X
 * @param {number} cy 物体の中心Y
 * @param {number} theta 斜面の角度（ラジアン）
 * @param {number} m 質量 (kg)
 * @param {number} g 重力加速度 (m/s²)
 */
function drawForceArrows(cx, cy, theta, m, g) {
  const mg = m * g;
  // 矢印の長さスケール：合力の矢印が約100ロジカルpxになるように
  const SCALE = 100 / mg;

  // theta（ラジアン）を度数に変換して logic.js の純粋関数に渡す
  const angleDeg = theta * (180 / Math.PI);
  // logic.js の calculateNormalForce / calculateSlopeForce を使って力の大きさを計算
  const fnMag = window._nfLogic.calculateNormalForce(m, g, angleDeg); // N = mg cosθ
  const fsMag = window._nfLogic.calculateSlopeForce(m, g, angleDeg);  // F = mg sinθ

  // 斜面方向の単位ベクトル（A→C, 下向き）: (cos θ, sin θ)
  let sx = cos(theta);
  let sy = sin(theta);
  // 法線方向の単位ベクトル（スロープ面から外向き）: (sin θ, -cos θ)
  let nx = sin(theta);
  let ny = -cos(theta);

  let arrowHead = 10;

  // 1. 重力 mg（下向き）: 物体が坂の面を押す力の元となる力
  let gLen = mg * SCALE;
  push();
  stroke(30, 30, 30);
  fill(30, 30, 30);
  strokeWeight(2);
  drawArrow(cx, cy, cx, cy + gLen, arrowHead);
  pop();
  drawForceLabel(cx + 30, cy + gLen * 0.6, "mg", color(30, 30, 30));

  // 2. 斜面方向成分（斜面に沿って下方向）: mg sin θ
  let fsLen = fsMag * SCALE;
  push();
  stroke(0, 100, 200);
  fill(0, 100, 200);
  strokeWeight(2);
  drawArrow(cx, cy, cx + fsLen * sx, cy + fsLen * sy, arrowHead);
  pop();
  // ラベル：矢印の終点から法線方向にオフセット
  drawForceLabel(
    cx + fsLen * sx * 0.5 + ny * 22,
    cy + fsLen * sy * 0.5 - nx * 22,
    "mg sinθ",
    color(0, 100, 200)
  );

  // 3. 斜面に垂直な成分（斜面へ向かう方向）: mg cos θ
  let fnLen = fnMag * SCALE;
  push();
  stroke(0, 160, 80);
  fill(0, 160, 80);
  strokeWeight(2);
  // 斜面に垂直な内向き方向: (-sin θ, cos θ)
  drawArrow(cx, cy, cx - fnLen * nx, cy - fnLen * ny, arrowHead);
  pop();
  // ラベル：矢印の中間点から斜面方向にオフセット
  drawForceLabel(
    cx - fnLen * nx * 0.5 - sx * 26,
    cy - fnLen * ny * 0.5 + sy * 26,
    "mg cosθ",
    color(0, 160, 80)
  );

  // 4. 垂直抗力 N（法線方向外向き）: N = mg cos θ
  push();
  stroke(200, 0, 0);
  fill(200, 0, 0);
  strokeWeight(2);
  drawArrow(cx, cy, cx + fnLen * nx, cy + fnLen * ny, arrowHead);
  pop();
  drawForceLabel(
    cx + fnLen * nx * 0.5 + sx * 24,
    cy + fnLen * ny * 0.5 - sy * 24,
    "N",
    color(200, 0, 0)
  );
}

/**
 * 力のラベルを描画する。
 * @param {number} x ラベルX
 * @param {number} y ラベルY
 * @param {string} label テキスト
 * @param {p5.Color} col テキスト色
 */
function drawForceLabel(x, y, label, col) {
  push();
  fill(col);
  noStroke();
  textFont("Noto Sans CJK JP, Noto Sans JP, Meiryo, sans-serif");
  textSize(17);
  textAlign(CENTER, CENTER);
  text(label, x, y);
  pop();
}

/**
 * 角度の弧と数値を描画する。
 * @param {{Ax,Ay,Bx,By,Cx,Cy,theta}} geo
 */
function drawAngleArc(geo) {
  let r = 50;
  // 角度は C 頂点（右下）の角度ではなく、底辺と斜面のなす角（theta）
  // C頂点で arc を描く: 底辺（左向き π）から斜面方向（上向き左 π + theta）
  push();
  noFill();
  stroke(80);
  strokeWeight(1.5);
  // Cから左方向（底辺方向）が π ラジアン、斜面の上方向（A方向）が π + theta
  let startAngle = PI;           // 左 (C→B方向)
  let endAngle   = PI + geo.theta; // 斜面方向（C→A）
  arc(geo.Cx, geo.Cy, r * 2, r * 2, startAngle, endAngle);
  pop();

  // 角度テキスト
  let midAngle = PI + geo.theta / 2;
  let tx = geo.Cx + (r + 16) * cos(midAngle);
  let ty = geo.Cy + (r + 16) * sin(midAngle);
  push();
  fill(60);
  noStroke();
  textFont("Noto Sans CJK JP, Noto Sans JP, Meiryo, sans-serif");
  textSize(20);
  textAlign(CENTER, CENTER);
  text(nf(degrees(geo.theta), 1, 0) + "°", tx, ty);
  pop();
}

/**
 * 斜面のジオメトリを計算して返す（ロジカル座標 1000x562 基準）。
 * 実装は logic.js の getSlopeGeometry() に委譲する。
 * @param {number} angleDeg 角度（度数）
 * @returns {{Ax,Ay,Bx,By,Cx,Cy,theta,slopeLen}}
 */
function getSlopeGeometry(angleDeg) {
  return window._nfLogic.getSlopeGeometry(angleDeg);
}

/**
 * 凡例はHTMLオーバーレイ（#legend）で表示するため、
 * このキャンバス版関数は使用しません。index.html の #legend 要素を参照してください。
 */


