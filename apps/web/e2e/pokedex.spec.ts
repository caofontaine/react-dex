import { expect, test } from '@playwright/test';

test('loads the pokedex table', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'React Dex' })).toBeVisible();
  await expect(page.locator('table')).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(25);
});

test('loads more rows on scroll', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(25);

  await page.mouse.wheel(0, 2000);

  await page.waitForFunction(
    async () => document.querySelectorAll('tbody tr').length > 25,
    null,
    { timeout: 15000 }
  );

  const newCount = await rows.count();
  expect(newCount).toBeGreaterThan(25);
});

test('filters results as you type', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.getByRole('textbox', { name: 'Search Pokémon' });
  await searchInput.fill('Pikachu');

  await expect(page.getByText('Pikachu', { exact: true })).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(1);
});

test('filters by type', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Electric').check();

  const rows = page.locator('tbody tr');
  await expect(rows.first()).toBeVisible();

  const rowCount = await rows.count();
  for (let i = 0; i < rowCount; i += 1) {
    const row = rows.nth(i);
    const types = await row.locator('td:nth-child(4), td:nth-child(5)').allTextContents();
    expect(types.some((text) => text.trim() === 'Electric')).toBeTruthy();
  }
});

test('persists caught state', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.getByRole('textbox', { name: 'Search Pokémon' });
  await searchInput.fill('Pikachu');

  const checkbox = page.getByRole('checkbox', { name: /mark pikachu as caught/i });
  await expect(checkbox).toBeVisible();
  await checkbox.click();
  await expect(checkbox).toBeChecked();

  await page.reload();
  await page.getByRole('textbox', { name: 'Search Pokémon' }).fill('Pikachu');

  const reloadedCheckbox = page.getByRole('checkbox', { name: /mark pikachu as caught/i });
  await expect(reloadedCheckbox).toBeChecked();
});
