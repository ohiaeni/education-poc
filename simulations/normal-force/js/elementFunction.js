// elementFunction.jsは仮想DOMメソッド管理専用のファイルです。

/**
 * スタートボタン押下時の処理
 */
function onStartClick() {
  isRunning = true;
}

/**
 * ストップボタン押下時の処理
 */
function onStopClick() {
  isRunning = false;
}

/**
 * 角度入力変更時の処理
 */
function onAngleChange() {
  let val = parseFloat(document.getElementById("angleInput").value);
  if (!isNaN(val)) {
    currentAngle = constrain(val, 1, 80);
    // 角度変更時はシミュレーションをリセット
    resetSimulation();
  }
}

/**
 * 質量入力変更時の処理
 */
function onMassChange() {
  let val = parseFloat(document.getElementById("massInput").value);
  if (!isNaN(val) && val > 0) {
    currentMass = val;
  }
}

/**
 * 重力加速度入力変更時の処理
 */
function onGravityChange() {
  let val = parseFloat(document.getElementById("gravityInput").value);
  if (!isNaN(val) && val > 0) {
    currentGravity = val;
  }
}
