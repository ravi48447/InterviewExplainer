import { expect, test } from "@playwright/test";

const goQuestion = "/go-fresher/go-strings-types/go-strings-types-type-conversion-vs-assertion-common-mistake";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  await page.goto(goQuestion, { waitUntil: "networkidle" });
});

test("question titles render inline Markdown and metadata is branded once", async ({ page }) => {
  const title = page.getByRole("heading", { level: 1 });
  await expect(title).toHaveText("How do conversions between string, []byte, and []rune differ?");
  await expect(title.locator("code")).toHaveCount(3);
  expect(await page.title()).not.toMatch(/InterviewExplainer\s*\|\s*InterviewExplainer/i);
});

test("reviewed Mermaid diagrams render at a readable intrinsic size", async ({ page }, testInfo) => {
  const diagram = page.getByTestId("mermaid-diagram").first();
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute("data-diagram-state", "ready", { timeout: 10_000 });
  await expect(diagram.locator("svg")).toBeVisible();

  const geometry = await diagram.evaluate((element) => {
    const svg = element.querySelector("svg");
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      svgWidth: svg?.getBoundingClientRect().width ?? 0,
      documentWidth: document.documentElement.scrollWidth,
    };
  });
  expect(geometry.svgWidth).toBeGreaterThan(300);
  expect(geometry.scrollWidth).toBeGreaterThanOrEqual(geometry.clientWidth);
  expect(geometry.documentWidth).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
});

test("mobile reaches Quick Revision without an oversized route or title", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile hierarchy assertion");
  const route = page.getByRole("navigation", { name: "Question route" }).locator("..");
  const title = page.getByRole("heading", { level: 1 });
  const quick = page.getByTestId("quick-revision");

  const measurements = await page.evaluate(() => {
    const routeElement = document.querySelector('nav[aria-label="Question route"]')?.parentElement;
    const titleElement = document.querySelector("h1");
    const quickElement = document.querySelector('[data-testid="quick-revision"]');
    return {
      routeHeight: routeElement?.getBoundingClientRect().height ?? Infinity,
      titleFont: Number.parseFloat(titleElement ? getComputedStyle(titleElement).fontSize : "999"),
      quickTop: quickElement?.getBoundingClientRect().top ?? Infinity,
    };
  });

  await expect(route).toBeVisible();
  await expect(title).toBeVisible();
  await expect(quick).toBeVisible();
  expect(measurements.routeHeight).toBeLessThanOrEqual(60);
  expect(measurements.titleFont).toBeLessThanOrEqual(23);
  expect(measurements.quickTop).toBeLessThanOrEqual(360);
});
