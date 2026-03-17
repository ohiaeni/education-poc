// index.jsはメインのメソッドを呼び出すためのファイルです。

// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける。
function draw() {
  scale(width / 1000);
  background(245, 245, 240);

  // 物理演算の更新
  updatePhysics();

  // 斜面ジオメトリの計算
  let geo = getSlopeGeometry(currentAngle);

  // 斜面を描画
  drawSlope(geo);

  // 角度の弧と数値を描画
  drawAngleArc(geo);

  // 斜面上の物体の接触点を計算
  let contactX = geo.Ax + sliderT * (geo.Cx - geo.Ax);
  let contactY = geo.Ay + sliderT * (geo.Cy - geo.Ay);

  // 物体を描画（lastObjCenterX / lastObjCenterY が更新される）
  drawObject(contactX, contactY, geo.theta);

  // 力の矢印を物体の中心から描画
  drawForceArrows(lastObjCenterX, lastObjCenterY, geo.theta, currentMass, currentGravity);
}

// windowResized関数
// デバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
}
