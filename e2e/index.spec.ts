import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	// TODO: Replace beforeEach with IndexedDB Session Sharing
	// https://github.com/microsoft/playwright/discussions/10715#discussioncomment-1904812
	await page.goto(`/`);
	const [popup] = await Promise.all([
		page.waitForEvent('popup'),
		page.getByText('Login with Google').click(),
	]);
	await popup.waitForLoadState();
	await popup.getByText('Add new account').click();
	await popup.getByText('Auto-generate user information').click();
	await popup.getByText('Sign in with Google.com').click();

	await page.getByText('Today').waitFor();
});

test('homepage', async ({ page }) => {
	await expect(page).toHaveTitle(/kcalCalc/);
	await page.screenshot({ path: 'screenshot.png', fullPage: true });
});
