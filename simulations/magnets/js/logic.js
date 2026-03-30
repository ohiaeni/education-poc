// logic.js — 磁場のコンター（等値線）計算ロジック

import { state } from "./state.js";

/**
 * 磁場のベクトルポテンシャル角度 Qangle(x, y) を計算する。
 *
 * 各磁石 i に対して
 *   atan2(x - Nx_i, y - Ny_i) − atan2(x − Sx_i, y − Sy_i)
 * の総和を返す。
 *
 * 注意: atan2 の引数が (dx, dy) ではなく (dx, dy) の順（Java 原版互換）。
 *
 * @param {number} cx キャンバス座標 X
 * @param {number} cy キャンバス座標 Y
 * @param {Array}  magnets 磁石配列
 * @param {number} R       磁石半長さ
 * @returns {number}
 */
export function calcQangle(cx, cy, magnets, R) {
  let sum = 0;
  for (const m of magnets) {
    const nx = m.nxAt(R),
      ny = m.nyAt(R);
    const sx = m.sxAt(R),
      sy = m.syAt(R);
    // Java 版: Math.atan2(xx - X, yy - Y) — x 差分が第 1 引数
    sum += Math.atan2(cx - nx, cy - ny) - Math.atan2(cx - sx, cy - sy);
  }
  return sum;
}

/**
 * 磁気スカラーポテンシャル V(x, y) を計算する。
 *
 * V = log( ∏ rS_i² / ∏ rN_i² )
 *   = Σ log( rS_i² / rN_i² )
 *
 * @param {number} cx キャンバス座標 X
 * @param {number} cy キャンバス座標 Y
 * @param {Array}  magnets 磁石配列
 * @param {number} R       磁石半長さ
 * @returns {number}
 */
export function calcScalarV(cx, cy, magnets, R) {
  let V1 = 1.0; // ∏ (N 極からの距離²)
  let V2 = 1.0; // ∏ (S 極からの距離²)
  for (const m of magnets) {
    const nx = m.nxAt(R),
      ny = m.nyAt(R);
    const sx = m.sxAt(R),
      sy = m.syAt(R);
    V1 *= (cx - nx) ** 2 + (cy - ny) ** 2;
    V2 *= (cx - sx) ** 2 + (cy - sy) ** 2;
  }
  if (V1 <= 0 || V2 <= 0) return 0;
  return Math.log(V2 / V1);
}

/**
 * (cx, cy) が任意の極の近く（半径 hankei 以内）かどうかを返す。
 *
 * @param {number} cx
 * @param {number} cy
 * @param {Array}  magnets
 * @param {number} R
 * @param {number} hankei
 * @returns {boolean}
 */
export function isNearAnyPole(cx, cy, magnets, R, hankei) {
  const h2 = hankei * hankei;
  for (const m of magnets) {
    const nx = m.nxAt(R),
      ny = m.nyAt(R);
    const sx = m.sxAt(R),
      sy = m.syAt(R);
    if ((cx - nx) ** 2 + (cy - ny) ** 2 <= h2) return true;
    if ((cx - sx) ** 2 + (cy - sy) ** 2 <= h2) return true;
  }
  return false;
}

/**
 * state.fieldBuffer に磁力線・等磁位線のコンター画像を書き込む。
 * ドラッグ中は呼ばれないため、変更後に 1 回だけ実行される。
 *
 * アルゴリズム:
 *   1. バッファ解像度（FIELD_SCALE 間引き）で A[bx][by], V[bx][by] を計算。
 *   2. ブランチカット補正配列 cut[bx][by] を構築。
 *   3. 隣接ピクセル間で整数部が変化するピクセルをコンターとして着色。
 */
export function recomputeField() {
  const {
    magnets,
    R,
    HANKEI,
    N,
    Vstep,
    showFieldLines,
    showPotential,
    fieldBuffer,
    FIELD_SCALE,
  } = state;

  if (!fieldBuffer) return;

  const bw = fieldBuffer.width;
  const bh = fieldBuffer.height;
  const sc = FIELD_SCALE; // バッファ 1 px = sc canvas px

  fieldBuffer.background(255);
  fieldBuffer.loadPixels();

  // 磁石がないか両フラグが OFF の場合は白地で終了
  if (magnets.length === 0 || (!showFieldLines && !showPotential)) {
    fieldBuffer.updatePixels();
    state.fieldDirty = false;
    return;
  }

  const stride = bw + 1; // A/V 配列の行幅（コンター比較に bw+1 列必要）
  const totalCells = stride * (bh + 1);

  // --- ポテンシャル計算 ---
  const A = showFieldLines ? new Float32Array(totalCells) : null;
  const V = showPotential ? new Float32Array(totalCells) : null;

  let Vmin = Infinity,
    Vmax = -Infinity;

  for (let bx = 0; bx <= bw; bx++) {
    for (let by = 0; by <= bh; by++) {
      const cx = bx * sc;
      const cy = by * sc;
      const idx = bx + by * stride;
      if (A) {
        A[idx] = Math.floor((N * calcQangle(cx, cy, magnets, R)) / Math.PI);
      }
      if (V) {
        const v = Math.floor(0.25 * Vstep * calcScalarV(cx, cy, magnets, R));
        V[idx] = v;
        if (v < Vmin) Vmin = v;
        if (v > Vmax) Vmax = v;
      }
    }
  }

  // --- ブランチカット補正配列（磁力線用）---
  // 各磁石の N/S 極から上方向へ伸びる不連続性を補正する。
  const cut = A ? new Int32Array(stride * bh) : null;
  if (cut) {
    for (const m of magnets) {
      const bnx = Math.floor(m.nxAt(R) / sc);
      const bny = Math.floor(m.nyAt(R) / sc);
      const bsx = Math.floor(m.sxAt(R) / sc);
      const bsy = Math.floor(m.syAt(R) / sc);
      // N 極から上端（y=0）まで: cut += 1
      if (bnx >= 0 && bnx < bw) {
        for (let j = 0; j < bny && j < bh; j++) {
          cut[bnx + j * stride] += 1;
        }
      }
      // S 極から上端（y=0）まで: cut -= 1
      if (bsx >= 0 && bsx < bw) {
        for (let j = 0; j < bsy && j < bh; j++) {
          cut[bsx + j * stride] -= 1;
        }
      }
    }
  }

  const vRange = Vmax > Vmin ? Vmax - Vmin : 1;

  // --- コンター検出して着色 ---
  for (let bx = 0; bx < bw; bx++) {
    for (let by = 0; by < bh; by++) {
      const cx = bx * sc;
      const cy = by * sc;

      // 極付近はスキップ（特異点を避ける）
      if (isNearAnyPole(cx, cy, magnets, R, HANKEI)) continue;

      const idx = bx + by * stride;
      const pIdx = (bx + by * bw) * 4; // pixels 配列のインデックス

      // --- 磁力線コンター（ブランチカット補正付き）---
      // Java 原版のコンター条件:
      //   A[x][y] != A[x][y+1]
      //   || A[x][y] != A[x+1][y+1] - 2*N*cut[x][y]
      //   || A[x][y] != A[x+1][y]   - 2*N*cut[x][y]
      if (A) {
        const c = cut[idx];
        const a00 = A[idx];
        const a01 = A[idx + stride]; // (bx,   by+1)
        const a10 = A[idx + 1]; // (bx+1, by  )
        const a11 = A[idx + 1 + stride]; // (bx+1, by+1)
        if (a00 !== a01 || a00 !== a10 - 2 * N * c || a00 !== a11 - 2 * N * c) {
          fieldBuffer.pixels[pIdx] = 30;
          fieldBuffer.pixels[pIdx + 1] = 80;
          fieldBuffer.pixels[pIdx + 2] = 200;
          fieldBuffer.pixels[pIdx + 3] = 255;
          continue; // 磁力線の方を優先
        }
      }

      // --- 等磁位線コンター ---
      if (V) {
        const v00 = V[idx];
        const v01 = V[idx + stride];
        const v10 = V[idx + 1];
        const v11 = V[idx + 1 + stride];
        if (v00 !== v01 || v00 !== v10 || v00 !== v11) {
          // Java 原版の配色: new Color(c, 255-c, c) — グリーン→マゼンタ
          const t = Math.round((255 * (v00 - Vmin)) / vRange);
          fieldBuffer.pixels[pIdx] = t;
          fieldBuffer.pixels[pIdx + 1] = 255 - t;
          fieldBuffer.pixels[pIdx + 2] = t;
          fieldBuffer.pixels[pIdx + 3] = 255;
        }
      }
    }
  }

  fieldBuffer.updatePixels();
  state.fieldDirty = false;
}
