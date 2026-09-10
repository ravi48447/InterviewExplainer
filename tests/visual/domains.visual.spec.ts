import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  await page.goto("/domains", { waitUntil: "networkidle" });
});

test("Domain Explorer renders real repository paths without overflow", async ({ page }, testInfo) => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Explore interview paths");
  await expect(page.getByRole("heading", { name: "Choose where you want to begin" })).toBeVisible();
  await expect(page.getByText(/Showing \d+ of \d+ paths/)).toBeVisible();
  await expect(page.getByText("Live", { exact: true }).first()).toBeVisible();

  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
  await expect(page).toHaveScreenshot("domains-page.png", { fullPage: true });
});

test("language and search filters visibly update the path library", async ({ page }) => {
  await page.getByRole("button", { name: "Python" }).click();
  await expect(page.getByText(/Showing 4 of \d+ paths/)).toBeVisible();

  await page.getByPlaceholder("Search language, role, or path...").fill("not-a-real-path");
  await expect(page.getByRole("heading", { name: "No paths match these filters" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText("Java Backend", { exact: true }).first()).toBeVisible();
});

test("the dominant action and live paths use canonical destinations", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Browse live paths" })).toHaveAttribute("href", "#domain-library");
  await expect(page.locator("#domain-library a[href]").first()).toHaveAttribute("href", "/java-backend-intermediate");
});
