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
	const itemLabel = 'Nutella';
	const bucketLabel = 'Breakfast';
	const date = toISODateString(new Date());

	await page.getByTestId(`track-item-${bucketLabel}-${date}`).click();
	await page.getByLabel('Search').fill(itemLabel);
	await page.getByRole('button', { name: 'Search for item on internet' }).click();
	await page.locator(`button:has-text("Nutella")`).first().click();
	await page.getByRole('button', { name: 'Select' }).click();
	await page.getByLabel('Amount', { exact: true }).fill('1337');
	await page.getByRole('button', { name: 'Track' }).click();

	const todayBreakfastBucket = page.getByTestId(`bucket-${bucketLabel}-${date}`);
	expect(await todayBreakfastBucket.getByText(itemLabel).isVisible()).toBeTruthy();
});

test('create new item and track from edit page', async ({ page }) => {
	const itemLabel = 'Emmer-Dinkelbrot';
	const bucketLabel = 'Snacks';
	const date = toISODateString(new Date());

	await page.getByRole('button', { name: 'Items' }).click();
	await page.getByRole('button', { name: 'New Item' }).click();
	await page.getByLabel('Label').fill(itemLabel);
	await page.getByLabel('Brand / Date / Whatever').fill('Essmanns');
	await page.getByLabel('kcal per 100 g || ml').fill('284');
	await page.getByTestId('track-now').click();
	await page.getByLabel('Amount').fill('1337');
	await page.getByRole('button', { name: 'Track' }).click();
	await page.getByRole('button', { name: bucketLabel }).click();
	await page.keyboard.press('Escape');
	await page.getByTestId(`bucket-button-${bucketLabel}-${date}`).click();

	const todayBreakfastBucket = page.getByTestId(`bucket-${bucketLabel}-${date}`);
	expect(await todayBreakfastBucket.getByText(itemLabel).isVisible()).toBeTruthy();
});
