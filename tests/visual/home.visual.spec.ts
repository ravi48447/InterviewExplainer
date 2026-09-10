import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  await page.goto("/", { waitUntil: "networkidle" });
});

test("home matches the approved visual baseline", async ({ page }, testInfo) => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Understand every concept",
  );
  await expect(page.getByRole("heading", { name: "Choose your domain" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your journey to success" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "From problem statement to interview-ready understanding." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Different algorithms deserve different visual worlds." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Browse the material before you commit to a path." }),
  ).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "Search interview concepts and questions" })).toBeVisible();

  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);

  await expect(page).toHaveScreenshot("home-page.png", { fullPage: true });
});

test("domain selection updates the recommended destination", async ({ page }) => {
  const frontendCard = page.getByRole("button", { name: /Frontend/i });
  await frontendCard.click();
  await expect(frontendCard).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/Start with Frontend/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore this domain" })).toHaveAttribute(
    "href",
    "/domains?language=Frontend",
  );
});

test("core actions and controls remain available", async ({ page }, testInfo) => {
  await expect(page.getByRole("link", { name: "Start learning" })).toHaveAttribute("href", "/select");
  await expect(page.getByRole("link", { name: "Explore DSA" })).toHaveAttribute("href", "/dsa");
  await expect(page.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
  await expect(page.getByRole("link", { name: "Open the complete lesson" })).toHaveAttribute(
    "href",
    "/dsa/problem/longest-substring-without-repeat",
  );
  await expect(page.getByRole("link", { name: "Explore all DSA" })).toHaveAttribute("href", "/dsa");

  if (testInfo.project.name === "desktop") {
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Switch theme/ })).toBeVisible();
  } else {
    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
  }
});
