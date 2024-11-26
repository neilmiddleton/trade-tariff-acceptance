// @ts-check
const { test, expect } = require('@playwright/test');

test('can find footnotes on honey', async ({ page }) => {
  await page.goto('/find_commodity');
  await page.getByLabel('Search the UK Integrated').click();
  await page.getByLabel('Search the UK Integrated').fill('honey');
  await page.getByRole('option', { name: 'honey', exact: true }).click();
  await page.getByRole('link', { name: 'Mānuka honey   (code' }).click();
  await page.getByPlaceholder('All countries').click();
  await page.getByRole('option', { name: 'Greece (GR)' }).click();
  await page.getByLabel('Import').getByText('DS160').click();
});

test('can read quota measure', async ({ page }) => {
  await page.goto('/commodities/0409000010');
  await expect(page.locator('h1')).toContainText('Commodity 0409000010');
  await page.getByRole('link', { name: 'Quotas' }).click();
  await expect(page.locator('#measure-20119757')).toContainText('Mexico (MX)');
  await expect(page.locator('#measure-20119757')).toContainText('8.00%');
});

test('can use different trade dates', async ({ page }) => {
  await page.goto('/commodities/0406103010');
  await page.getByRole('link', { name: 'Change' }).click();
  await page.getByLabel('Year').click();
  await page.getByLabel('Year').fill('2023');
  await page.getByLabel('Month').click();
  await page.getByLabel('Month').fill('13');
  await page.getByRole('button', { name: 'Update date' }).click();
  await expect(page.getByRole('alert')).toContainText('Enter a valid date');
  await page.getByLabel('Day').click();
  await page.getByLabel('Day').fill('01');
  await page.getByLabel('Day').press('Tab');
  await page.getByLabel('Month').fill('01');
  await page.getByLabel('Month').press('Tab');
  await page.getByLabel('Year').fill('2023');
  await page.getByRole('button', { name: 'Update date' }).click();
  await expect(page.locator('dl')).toContainText('1 January 2023');
});

test('can select different countries', async ({ page }) => {
  await page.goto('/commodities/0406103010');
  await page.getByPlaceholder('All countries').click();
  await page.getByRole('option', { name: 'France (FR)' }).click();
  await expect(page.locator('#measure-20125838')).toContainText('European Union (1013)');
  await expect(page.locator('#measure-20125838')).toContainText('0.00%');
});

test('rules of origin', async ({ page }) => {
  await page.goto('/commodities/0406103010?country=AL#rules-of-origin');
  await page.getByRole('tab', { name: 'Origin' }).click();
  await page.getByRole('button', { name: 'Start now' }).click();
  await page.getByLabel('I am exporting goods from the').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('#edit_rules_of_origin_steps_components_definition_components_definition div').filter({ hasText: 'Accessories, spare parts and' }).locator('span').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Yes, my goods are wholly').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('h1')).toContainText('Product-specific rules met');
});
