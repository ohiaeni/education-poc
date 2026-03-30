import { test, expect } from "@playwright/test";

const PAGE_URL = "/projectile-motion/index.html";

test.describe("斜方投射シミュレーション — UI表示テスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    // p5.js の setup() が完了するまで canvas が現れるのを待つ
    await page.waitForSelector("#p5Canvas canvas", { timeout: 10000 });
  });

  test("ページタイトルが正しい", async ({ page }) => {
    await expect(page).toHaveTitle("斜方投射のシミュレーション");
  });

  test("ナビゲーションバーが表示される", async ({ page }) => {
    await expect(page.locator("#navBar")).toBeVisible();
    await expect(page.locator(".navbar-brand")).toHaveText("Bicpema");
    await expect(page.locator("#navBar .text-light")).toContainText(
      "斜方投射のシミュレーション"
    );
  });

  test("p5.js キャンバスが描画される", async ({ page }) => {
    const canvas = page.locator("#p5Canvas canvas");
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test("投射・リセットボタンが表示される", async ({ page }) => {
    await expect(page.locator("#launchBtn")).toBeVisible();
    await expect(page.locator("#resetBtn")).toBeVisible();
    await expect(page.locator("#launchBtn")).toHaveText("投射する");
    await expect(page.locator("#resetBtn")).toHaveText("リセット");
  });

  test("初速・角度・重力加速度の入力欄が表示される", async ({ page }) => {
    await expect(page.locator("#velocityInput")).toBeVisible();
    await expect(page.locator("#angleInput")).toBeVisible();
    await expect(page.locator("#gravityInput")).toBeVisible();
  });

  test("各入力欄のデフォルト値が正しい", async ({ page }) => {
    await expect(page.locator("#velocityInput")).toHaveValue("15");
    await expect(page.locator("#angleInput")).toHaveValue("30");
    await expect(page.locator("#gravityInput")).toHaveValue("9.8");
  });

  test("ページのスクリーンショットが一致する（スナップショット）", async ({
    page,
  }) => {
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("projectile-motion-initial.png", {
      maxDiffPixelRatio: 0.05,
    });
  });
});
