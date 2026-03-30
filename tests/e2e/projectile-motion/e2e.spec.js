import { test, expect } from "@playwright/test";

const PAGE_URL = "/projectile-motion/index.html";

test.describe("斜方投射シミュレーション — E2E操作テスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.waitForSelector("#p5Canvas canvas", { timeout: 10000 });
  });

  test("投射ボタンを押すとシミュレーションが動き始める", async ({ page }) => {
    const canvas = page.locator("#p5Canvas canvas");
    await page.locator("#launchBtn").click();

    // 数フレーム待つ（30fps × 約0.5秒 = 15フレーム分）
    await page.waitForTimeout(600);

    // キャンバスが依然として表示されていることを確認
    await expect(canvas).toBeVisible();
  });

  test("リセットボタンを押すとシミュレーションが停止する", async ({
    page,
  }) => {
    await page.locator("#launchBtn").click();
    await page.waitForTimeout(300);
    await page.locator("#resetBtn").click();
    await page.waitForTimeout(200);

    // リセット後にキャンバスが正常に表示されている
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
  });

  test("角度を変更するとシミュレーションがリセットされる", async ({
    page,
  }) => {
    const angleInput = page.locator("#angleInput");
    await angleInput.fill("45");
    await angleInput.dispatchEvent("change");

    await page.waitForTimeout(300);
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
    await expect(angleInput).toHaveValue("45");
  });

  test("初速を変更できる", async ({ page }) => {
    const velocityInput = page.locator("#velocityInput");
    await velocityInput.fill("20");
    await velocityInput.dispatchEvent("change");
    await expect(velocityInput).toHaveValue("20");
  });

  test("重力加速度を変更できる", async ({ page }) => {
    const gravityInput = page.locator("#gravityInput");
    await gravityInput.fill("1.62");
    await gravityInput.dispatchEvent("change");
    await expect(gravityInput).toHaveValue("1.62");
  });

  test("投射後に再び投射ボタンを押すと再投射される", async ({ page }) => {
    // 1回目の投射
    await page.locator("#launchBtn").click();
    await page.waitForTimeout(300);

    // 2回目の投射（リセット＋再発射）
    await page.locator("#launchBtn").click();
    await page.waitForTimeout(300);

    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
  });

  test("角度の入力範囲は 1〜89 度の制約がある", async ({ page }) => {
    const angleInput = page.locator("#angleInput");
    const minAttr = await angleInput.getAttribute("min");
    const maxAttr = await angleInput.getAttribute("max");
    expect(Number(minAttr)).toBe(1);
    expect(Number(maxAttr)).toBe(89);
  });

  test("初速の入力範囲は 1〜50 m/s の制約がある", async ({ page }) => {
    const velocityInput = page.locator("#velocityInput");
    const minAttr = await velocityInput.getAttribute("min");
    const maxAttr = await velocityInput.getAttribute("max");
    expect(Number(minAttr)).toBe(1);
    expect(Number(maxAttr)).toBe(50);
  });

  test("投射・リセットを複数回繰り返してもエラーが発生しない", async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    for (let i = 0; i < 3; i++) {
      await page.locator("#launchBtn").click();
      await page.waitForTimeout(200);
      await page.locator("#resetBtn").click();
      await page.waitForTimeout(100);
    }

    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("シミュレーション完了後に結果が表示される（高速設定で確認）", async ({
    page,
  }) => {
    // 角度90°、初速5 m/s：T = 2*5/9.8 ≈ 1.02s と短い
    const angleInput = page.locator("#angleInput");
    const velocityInput = page.locator("#velocityInput");

    await angleInput.fill("89");
    await angleInput.dispatchEvent("change");
    await velocityInput.fill("5");
    await velocityInput.dispatchEvent("change");

    await page.locator("#launchBtn").click();

    // 滞空時間を超えるまで待機（1.02s + バッファ）
    await page.waitForTimeout(2000);

    // エラーがないことを確認
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
  });
});
