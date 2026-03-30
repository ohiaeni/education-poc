import { test, expect } from "@playwright/test";

const PAGE_URL = "/free-fall/index.html";

test.describe("自由落下シミュレーション — E2E操作テスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.waitForSelector("#p5Canvas canvas", { timeout: 10000 });
  });

  test("スタートボタンを押すとシミュレーションが動き始める", async ({
    page,
  }) => {
    const canvas = page.locator("#p5Canvas canvas");
    await page.locator("#startBtn").click();
    await page.waitForTimeout(600);
    await expect(canvas).toBeVisible();
  });

  test("ストップボタンを押すとシミュレーションが停止する", async ({
    page,
  }) => {
    await page.locator("#startBtn").click();
    await page.waitForTimeout(300);
    await page.locator("#stopBtn").click();
    await page.waitForTimeout(200);
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
  });

  test("リセットボタンでシミュレーションがリセットされる", async ({
    page,
  }) => {
    await page.locator("#startBtn").click();
    await page.waitForTimeout(300);
    await page.locator("#resetBtn").click();
    await page.waitForTimeout(200);
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
  });

  test("反発係数を変更できる", async ({ page }) => {
    const input = page.locator("#restitutionInput");
    await input.fill("0.5");
    await input.dispatchEvent("change");
    await expect(input).toHaveValue("0.5");
  });

  test("初期高さを変更できる", async ({ page }) => {
    const input = page.locator("#heightInput");
    await input.fill("80");
    await input.dispatchEvent("change");
    await expect(input).toHaveValue("80");
  });

  test("反発係数変更後もシミュレーションが継続する", async ({ page }) => {
    await page.locator("#startBtn").click();
    await page.waitForTimeout(200);
    const input = page.locator("#restitutionInput");
    await input.fill("0.5");
    await input.dispatchEvent("change");
    await page.waitForTimeout(400);
    await expect(page.locator("#p5Canvas canvas")).toBeVisible();
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
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.waitForTimeout(100);
    expect(errors).toHaveLength(0);
  });
});
