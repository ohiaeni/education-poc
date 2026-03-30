import { test, expect } from "@playwright/test";

const PAGE_URL = "/free-fall/index.html";

test.describe("自由落下シミュレーション — UI表示テスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.waitForSelector("#p5Canvas canvas", { timeout: 10000 });
  });

  test("ページタイトルが正しい", async ({ page }) => {
    await expect(page).toHaveTitle("自由落下のシミュレーション");
  });

  test("ナビゲーションバーが表示される", async ({ page }) => {
    await expect(page.locator("#navBar")).toBeVisible();
    await expect(page.locator(".navbar-brand")).toHaveText("Bicpema");
    await expect(page.locator("#navBar .text-light")).toContainText(
      "自由落下のシミュレーション"
    );
  });

  test("p5.js キャンバスが描画される", async ({ page }) => {
    const canvas = page.locator("#p5Canvas canvas");
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test("スタート・ストップ・リセットボタンが表示される", async ({ page }) => {
    await expect(page.locator("#startBtn")).toBeVisible();
    await expect(page.locator("#stopBtn")).toBeVisible();
    await expect(page.locator("#resetBtn")).toBeVisible();
    await expect(page.locator("#startBtn")).toHaveText("スタート");
    await expect(page.locator("#stopBtn")).toHaveText("ストップ");
    await expect(page.locator("#resetBtn")).toHaveText("リセット");
  });

  test("反発係数・初期高さの入力欄が表示される", async ({ page }) => {
    await expect(page.locator("#restitutionInput")).toBeVisible();
    await expect(page.locator("#heightInput")).toBeVisible();
  });

  test("各入力欄のデフォルト値が正しい", async ({ page }) => {
    await expect(page.locator("#restitutionInput")).toHaveValue("0.8");
    await expect(page.locator("#heightInput")).toHaveValue("50");
  });

  test("反発係数の入力範囲は 0〜1 である", async ({ page }) => {
    const input = page.locator("#restitutionInput");
    expect(Number(await input.getAttribute("min"))).toBe(0);
    expect(Number(await input.getAttribute("max"))).toBe(1);
  });

  test("初期高さの入力範囲は 10〜100 m である", async ({ page }) => {
    const input = page.locator("#heightInput");
    expect(Number(await input.getAttribute("min"))).toBe(10);
    expect(Number(await input.getAttribute("max"))).toBe(100);
  });
});
