import { expect, test } from "@playwright/test";

const problemUrl = "/dsa/problem/longest-substring-without-repeat";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addInitScript(() => {
    window.localStorage.setItem("theme", "light");
    window.localStorage.setItem("ie-dsa-lang", "java");
  });
  await page.goto(problemUrl, { waitUntil: "networkidle" });
});

test("the controlled walkthrough uses the real dry-run state", async ({ page }, testInfo) => {
  const walkthrough = page.getByRole("region", { name: "Visual walkthrough" });
  await expect(walkthrough).toBeVisible();
  await expect(walkthrough.getByText("Step 1 of 6")).toBeVisible();
  await expect(walkthrough.getByText("left=0, best=1")).toBeVisible();
  await expect(walkthrough.getByRole("button", { name: "Play" })).toBeDisabled();

  await walkthrough.getByRole("button", { name: "Next explanation step" }).click();
  await expect(walkthrough.getByText("Step 2 of 6")).toBeVisible();
  await expect(walkthrough.getByText("left=0, best=2")).toBeVisible();
  await expect(walkthrough.getByText("last.put(c, right);")).toBeVisible();

  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
  await expect(walkthrough).toHaveScreenshot("dsa-study-workbench.png");
});

test("language switching updates the connected teaching line", async ({ page }) => {
  const walkthrough = page.getByRole("region", { name: "Visual walkthrough" });
  await walkthrough.getByRole("tab", { name: "Python" }).click();
  await expect(walkthrough.getByText("last[c] = right")).toBeVisible();
});

test("mobile presents the visual before examples", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile reading-order assertion");
  const visual = page.getByRole("region", { name: "Visual walkthrough" });
  const examples = page.getByText("Examples", { exact: true });
  await expect(visual).toBeVisible();
  expect(
    await visual.evaluate((element) =>
      Boolean(element.compareDocumentPosition(document.querySelector("main")!.querySelector("dl")) & Node.DOCUMENT_POSITION_FOLLOWING),
    ),
  ).toBe(true);
  await expect(examples).toBeVisible();
});
