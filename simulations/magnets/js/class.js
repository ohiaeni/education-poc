// class.js — クラス管理専用のファイルです。

/**
 * BicpemaCanvasController
 * キャンバスの生成とリサイズを担当する。
 */
export class BicpemaCanvasController {
  /**
   * @param {boolean} f   画面回転時に 16:9 の比率を固定するか
   * @param {boolean} i   WEBGL (3D) を使用するか
   * @param {number}  w_r 幅の比率 (0.0〜1.0)
   * @param {number}  h_r 高さの比率 (0.0〜1.0)
   */
  constructor(f = true, i = false, w_r = 1.0, h_r = 1.0) {
    this.fixed = f;
    this.is3D = i;
    this.widthRatio = w_r;
    this.heightRatio = h_r;
  }

  /** #p5Canvas と #navBar を元にキャンバスを生成する */
  fullScreen() {
    const P5_CANVAS = select("#p5Canvas");
    const NAV_BAR = select("#navBar");
    let w, h;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    const canvas = this.is3D
      ? createCanvas(w * this.widthRatio, h * this.heightRatio, WEBGL)
      : createCanvas(w * this.widthRatio, h * this.heightRatio);
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  /** 画面サイズが変わったときにキャンバスをリサイズする */
  resizeScreen() {
    const NAV_BAR = select("#navBar");
    let w, h;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}

/**
 * Magnet — 棒磁石を表すクラス。
 * 中心座標 (x, y) と向き (cosA, sinA) を持つ。
 * N 極は +方向、S 極は −方向に R px だけ離れた位置にある。
 */
export class Magnet {
  /**
   * @param {number} x 中心 X 座標 (canvas px)
   * @param {number} y 中心 Y 座標 (canvas px)
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    /** 向きの cos 成分 (初期値: 右向き) */
    this.cosA = 1.0;
    /** 向きの sin 成分 (初期値: 水平) */
    this.sinA = 0.0;
  }

  /** N 極の X 座標 */
  nxAt(R) {
    return this.x + R * this.cosA;
  }
  /** N 極の Y 座標 */
  nyAt(R) {
    return this.y + R * this.sinA;
  }
  /** S 極の X 座標 */
  sxAt(R) {
    return this.x - R * this.cosA;
  }
  /** S 極の Y 座標 */
  syAt(R) {
    return this.y - R * this.sinA;
  }

  /**
   * 磁石の向きを、指定座標方向に向くように更新する。
   * @param {number} tx 目標 X
   * @param {number} ty 目標 Y
   */
  setAngleTo(tx, ty) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r > 0.5) {
      this.cosA = dx / r;
      this.sinA = dy / r;
    }
  }

  /**
   * 位置をキャンバス境界内にクランプして更新する。
   * @param {number} x    新しい X
   * @param {number} y    新しい Y
   * @param {number} cw   キャンバス幅
   * @param {number} ch   キャンバス高さ
   * @param {number} hankei インタラクション半径
   */
  setPosition(x, y, cw, ch, hankei) {
    this.x = Math.max(hankei, Math.min(cw - hankei, x));
    this.y = Math.max(hankei, Math.min(ch - hankei, y));
  }
}
