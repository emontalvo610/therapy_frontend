import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/");

  await page.getByTestId("test-keyword").fill("Healthcare");

  await page.waitForTimeout(500);

  // Check if the mocked results appear in the table
  const rows = page.locator("tbody tr");
  await expect(rows).toHaveCount(10);
});
