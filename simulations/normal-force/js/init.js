// init.jsは初期処理専用のファイルです。

const FPS = 30;
let canvasController;

// シミュレーション状態
let isRunning = false;
let currentAngle = 30;    // 角度（度数）
let currentMass = 1.0;    // 質量 (kg)
let currentGravity = 9.8; // 重力加速度 (m/s²)

// 物体の位置管理
let sliderT = 0;       // スロープ上の位置（0=上端, 1=下端）
let objVelocity = 0;   // 速度 (物理m/s)
const SLOPE_PHYS_LEN = 8; // 斜面の物理長さ (m)

// drawObject が更新する物体の中心座標
let lastObjCenterX = 0;
let lastObjCenterY = 0;

/**
 * settingInit関数
 * シミュレーションそのものの設定を行う。
 */
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textSize(16);
  textFont("Noto Sans CJK JP, Noto Sans JP, Meiryo, sans-serif");
}

/**
 * elementSelectInit関数
 * 仮想DOMを読み込むための関数。
 * このシミュレーションでは DOM 要素の選択は elementPositionInit 内で直接行うため、ここでは何もしない。
 */
function elementSelectInit() {}

/**
 * elementPositionInit関数
 * DOMイベントを登録する。
 */
function elementPositionInit() {
  document.getElementById("startBtn").addEventListener("click", onStartClick);
  document.getElementById("stopBtn").addEventListener("click", onStopClick);
  document.getElementById("angleInput").addEventListener("change", onAngleChange);
  document.getElementById("massInput").addEventListener("change", onMassChange);
  document.getElementById("gravityInput").addEventListener("change", onGravityChange);
}

/**
 * valueInit関数
 * 初期値を設定する。
 */
function valueInit() {
  resetSimulation();
}

/**
 * シミュレーションをリセットする。
 */
function resetSimulation() {
  sliderT = 0;
  objVelocity = 0;
}

/**
 * フレームごとに物理演算を更新する。
 * 実装は logic.js の updatePhysicsStep() に委譲する。
 */
function updatePhysics() {
  if (!isRunning) return;

  const dt = 1 / FPS;
  const result = window._nfLogic.updatePhysicsStep(
    objVelocity,
    sliderT,
    dt,
    currentGravity,
    currentAngle
  );
  objVelocity = result.velocity;
  sliderT = result.sliderT;

  if (sliderT >= 1) {
    // 下端に到達したらリセット
    resetSimulation();
  }
}
