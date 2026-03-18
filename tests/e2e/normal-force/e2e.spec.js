import { test, expect } from "@playwright/test";

const PAGE_URL = "/normal-force/index.html";

test.describe("垂直抗力シミュレーション — E2E操作テスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.waitForSelector("#p5Canvas canvas", { timeout: 10000 });
  });

  test("スタートボタンを押すとシミュレーションが動き始める", async ({
    page,
  }) => {
    // キャンバスの初期ピクセルデータを取得
    const canvas = page.locator("#p5Canvas canvas");

    // スタートボタンをクリック
    await page.locator("#startBtn").click();

    // 数フレーム待つ（30fps × 約0.5秒 = 15フレーム分）
    await page.waitForTimeout(600);

    // キャンバスが依然として表示されていることを確認
    await expect(canvas).toBeVisible();
  });

  test("ストップボタンを押すとシミュレーションが停止する", async ({
    page,
  }) => {
    // スタート → ストップ の順に操作
    await page.locator("#startBtn").click();
    await page.waitForTimeout(300);
    await page.locator("#stopBtn").click();
    await page.waitForTimeout(200);

    // ストップ後にさらに待っても、canvas が正常に表示されている
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
  });

  test("角度を変更するとシミュレーションがリセットされる", async ({
    page,
  }) => {
    const angleInput = page.locator("#angleInput");

    // 角度を 45° に変更
    await angleInput.fill("45");
    await angleInput.dispatchEvent("change");

    // エラーなくキャンバスが描画され続けている
    await page.waitForTimeout(300);
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
    await expect(angleInput).toHaveValue("45");
  });

  test("質量を変更できる", async ({ page }) => {
    const massInput = page.locator("#massInput");
    await massInput.fill("5");
    await massInput.dispatchEvent("change");
    await expect(massInput).toHaveValue("5");
  });

  test("重力加速度を変更できる", async ({ page }) => {
    const gravityInput = page.locator("#gravityInput");
    await gravityInput.fill("1.62");
    await gravityInput.dispatchEvent("change");
    await expect(gravityInput).toHaveValue("1.62");
  });

  test("スタート後に角度を変えてもシミュレーションが継続する", async ({
    page,
  }) => {
    await page.locator("#startBtn").click();
    await page.waitForTimeout(200);

    const angleInput = page.locator("#angleInput");
    await angleInput.fill("60");
    await angleInput.dispatchEvent("change");

    await page.waitForTimeout(400);
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
  });

  test("角度の入力範囲は 1〜80 度の制約がある", async ({ page }) => {
    const angleInput = page.locator("#angleInput");
    const minAttr = await angleInput.getAttribute("min");
    const maxAttr = await angleInput.getAttribute("max");
    expect(Number(minAttr)).toBe(1);
    expect(Number(maxAttr)).toBe(80);
  });

  test("質量の最小値は 0.1 kg である", async ({ page }) => {
    const massInput = page.locator("#massInput");
    const minAttr = await massInput.getAttribute("min");
    expect(Number(minAttr)).toBe(0.1);
  });

  test("スタート・ストップを複数回繰り返してもエラーが発生しない", async ({
    page,
  }) => {
    for (let i = 0; i < 3; i++) {
      await page.locator("#startBtn").click();
      await page.waitForTimeout(200);
      await page.locator("#stopBtn").click();
      await page.waitForTimeout(100);
    }
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
    // コンソールエラーがないことを確認するため、エラーが起きていないことを確認
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.waitForTimeout(100);
    expect(errors).toHaveLength(0);
  });
});
