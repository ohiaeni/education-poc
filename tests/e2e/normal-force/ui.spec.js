import { test, expect } from "@playwright/test";

const PAGE_URL = "/normal-force/index.html";

test.describe("垂直抗力シミュレーション — UI表示テスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    // p5.js の setup() が完了するまで canvas が現れるのを待つ
    await page.waitForSelector("#p5Canvas canvas", { timeout: 10000 });
  });

  test("ページタイトルが正しい", async ({ page }) => {
    await expect(page).toHaveTitle("垂直抗力のシミュレーション");
  });

  test("ナビゲーションバーが表示される", async ({ page }) => {
    await expect(page.locator("#navBar")).toBeVisible();
    await expect(page.locator(".navbar-brand")).toHaveText("Bicpema");
    await expect(page.locator("#navBar .text-light")).toContainText(
      "垂直抗力のシミュレーション"
    );
  });

  test("p5.js キャンバスが描画される", async ({ page }) => {
    const canvas = page.locator("#p5Canvas canvas");
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test("凡例（legend）が4項目表示される", async ({ page }) => {
    const items = page.locator("#legend .legend-item");
    await expect(items).toHaveCount(4);
  });

  test("スタート・ストップボタンが表示される", async ({ page }) => {
    await expect(page.locator("#startBtn")).toBeVisible();
    await expect(page.locator("#stopBtn")).toBeVisible();
    await expect(page.locator("#startBtn")).toHaveText("スタート");
    await expect(page.locator("#stopBtn")).toHaveText("ストップ");
  });

  test("角度・質量・重力加速度の入力欄が表示される", async ({ page }) => {
    await expect(page.locator("#angleInput")).toBeVisible();
    await expect(page.locator("#massInput")).toBeVisible();
    await expect(page.locator("#gravityInput")).toBeVisible();
  });

  test("各入力欄のデフォルト値が正しい", async ({ page }) => {
    await expect(page.locator("#angleInput")).toHaveValue("30");
    await expect(page.locator("#massInput")).toHaveValue("1.0");
    await expect(page.locator("#gravityInput")).toHaveValue("9.8");
  });

  test("ページのスクリーンショットが一致する（スナップショット）", async ({
    page,
  }) => {
    // キャンバス描画が安定するまで少し待つ
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("normal-force-initial.png", {
      maxDiffPixelRatio: 0.05,
    });
  });
});
