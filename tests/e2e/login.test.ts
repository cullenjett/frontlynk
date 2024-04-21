import { expect, test } from '@playwright/test';

test('Login happy path', async ({ page }) => {
  await page.goto('/');

  const emailTextbox = page.getByRole('textbox', { name: /email/i });
  await emailTextbox.click();
  await emailTextbox.fill('test@example.com');

  const passwordTextbox = page.getByRole('textbox', { name: /password/i });
  await passwordTextbox.click();
  await passwordTextbox.fill('Password1');

  await page.getByRole('button', { name: /Login/i }).click();

  await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();

  await page.getByRole('button', { name: /Toggle My Account Menu/i }).click();
  await page.getByRole('menuitem', { name: /Logout/i }).click();

  await expect(page.getByRole('heading', { name: /Login/ })).toBeVisible();
});
