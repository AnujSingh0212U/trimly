import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Trim your links")).toBeVisible();
  await expect(page.getByPlaceholder("Paste your long URL here")).toBeVisible();
});

test("pricing page loads", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText("Simple, transparent pricing")).toBeVisible();
});

test("404 page loads", async ({ page }) => {
  await page.goto("/nonexistent-page-xyz");
  await expect(page.getByText("404")).toBeVisible();
});
