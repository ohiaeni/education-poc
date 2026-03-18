// logic-browser.js は logic.js の純粋関数をブラウザのグローバルスコープに公開するブリッジファイルです。
// シミュレーションの非モジュールスクリプトから window._nfLogic 経由で参照できます。
import {
  getSlopeGeometry,
  calculateNormalForce,
  calculateSlopeForce,
  updatePhysicsStep,
  SLOPE_PHYS_LEN,
} from "./logic.js";

window._nfLogic = {
  getSlopeGeometry,
  calculateNormalForce,
  calculateSlopeForce,
  updatePhysicsStep,
  SLOPE_PHYS_LEN,
};
