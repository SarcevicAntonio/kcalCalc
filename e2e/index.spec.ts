import { expect, test } from '@playwright/test';
import { toISODateString } from '../src/lib/dateHelpers.js';

test.beforeEach(async ({ page }) => {
	// TODO: Replace beforeEach with IndexedDB Session Sharing
	// https://github.com/microsoft/playwright/discussions/10715#discussioncomment-1904812
	await page.goto(`/`);
	const [authPopup] = await Promise.all([
		page.waitForEvent('popup'),
		page.getByRole('button', { name: 'Login with Google' }).click(),
	]);
	await authPopup.waitForLoadState();
	await authPopup.getByRole('button', { name: 'Add new account' }).click();
	await authPopup.getByRole('button', { name: 'Auto-generate user information' }).click();
	await authPopup.getByRole('button', { name: 'Sign in with Google.com' }).click();
	await page.getByText('Today').waitFor();
	await authPopup.close();
});

test('track external item', async ({ page }) => {
	const label = 'Breakfast';
	const date = toISODateString(new Date());
	const todayBreakfastBucket = page.getByTestId(`bucket-${label}-${date}`);

	await page.getByTestId(`track-item-${label}-${date}`).click();
	await page.getByLabel('Search').fill('Nutella');
	await page.getByRole('button', { name: 'Search for item on internet' }).click();
	await page.getByRole('button', { name: 'Nutella 6 port. Ferrero 539 kcal%g||ml' }).click();
	await page.getByRole('button', { name: 'Select' }).click();
	await page.getByLabel('Amount', { exact: true }).fill('1337');
	await page.getByRole('button', { name: 'Track' }).click();

	expect(await todayBreakfastBucket.getByText('Nutella').isVisible()).toBeTruthy();
});
