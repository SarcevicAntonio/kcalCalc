import { expect, test } from '@playwright/test'
import { toISODateString } from '../src/lib/dateHelpers.js'

test.describe('App Test', () => {
	test.beforeEach(async ({ page }) => {
		page.on('console', (msg) => console.log('#BROWSER# ', msg.text()))

		// TODO: Replace beforeEach with IndexedDB Session Sharing
		// https://github.com/microsoft/playwright/discussions/10715#discussioncomment-1904812
		await page.goto(`/`)
		const [authPopup] = await Promise.all([
			page.waitForEvent('popup'),
			page.getByRole('button', { name: 'Login with Google' }).click(),
		])
		await authPopup.waitForLoadState()
		await authPopup.getByRole('button', { name: 'Add new account' }).click()
		await authPopup.getByRole('button', { name: 'Auto-generate user information' }).click()
		await authPopup.getByRole('button', { name: 'Sign in with Google.com' }).click()
		await page.getByText('Today').waitFor()
		await authPopup.close()
	})

	test('track external item', async ({ page }) => {
		const itemLabel = 'Nutella'
		const bucketLabel = 'Breakfast'
		const date = toISODateString(new Date())
		const searchInternetButton = page.getByRole('button', { name: 'Search for item on internet' })

		await page.getByTestId(`track-item-${bucketLabel}-${date}`).click()
		await page.getByLabel('Search').fill(itemLabel)
		await searchInternetButton.click()
		await page.locator(`button:has-text("Nutella")`).first().click()
		await page.getByRole('button', { name: 'Select' }).click()
		await page.getByLabel('Amount', { exact: true }).fill('1337')
		await page.getByRole('button', { name: 'Track' }).click()

		const todayBreakfastBucket = page.getByTestId(`bucket-${bucketLabel}-${date}`)
		expect(await todayBreakfastBucket.getByText(itemLabel).isVisible()).toBeTruthy()
	})

	test('create new item and track from edit page', async ({ page }) => {
		const itemLabel = 'Emmer-Dinkelbrot'
		const bucketLabel = 'Snacks'
		const date = toISODateString(new Date())

		await page.getByRole('button', { name: 'Items' }).click()
		await page.getByRole('button', { name: 'New Item' }).click()
		await page.getByLabel('Label').fill(itemLabel)
		await page.getByLabel('Brand / Date / Whatever').fill('Essmanns')
		await page.getByLabel('kcal per 100 g || ml').fill('284')
		await page.getByTestId('track-now').click()
		await page.getByLabel('Amount').fill('1337')
		await page.getByRole('button', { name: 'Track' }).click()
		await page.getByRole('button', { name: bucketLabel }).click()
		await page.keyboard.press('Escape')
		await page.getByTestId(`bucket-button-${bucketLabel}-${date}`).click()

		const todayBreakfastBucket = page.getByTestId(`bucket-${bucketLabel}-${date}`)
		expect(await todayBreakfastBucket.getByText(itemLabel).isVisible()).toBeTruthy()
	})

	test('create aglio and track from bucket', async ({ page }) => {
		const date = toISODateString(new Date())
		const dialog = page.getByTestId('item-drawer')
		const searchInternetButton = page.getByRole('button', { name: 'Search for item on internet' })

		const waitForIngredientDialogClose = async () => {
			await page
				.locator(
					'div:has-text("Track Item Label Brand / Date / Whatever kcal per 100 g || ml EAN (Barcode) Item")' // TODO: fix this locator;
				)
				.waitFor({ state: 'hidden' })
		}

		// Aglio erstellen
		await page.getByRole('button', { name: 'Items' }).click()
		await page.getByRole('button', { name: 'New Item' }).click()
		await page.getByLabel('Label').fill('Spaghetti aglio, olio e peperoncino')
		await page.getByTestId('set-date-as-brand').click()

		// Spaghetti
		await dialog.getByRole('button', { name: 'Track Item' }).click()
		await page.getByLabel('Search').fill('Spaghetti')
		await searchInternetButton.click()
		await page
			.getByRole('button', { name: 'Spaghetti, roh Durchschnittswert 330 kcal%g||ml' })
			.click()
		await page.getByRole('button', { name: 'Select' }).click()
		await page.getByLabel('Amount').fill('500')
		await page.getByRole('button', { name: 'Track' }).click()
		await waitForIngredientDialogClose()

		// Parmesan
		await dialog.getByRole('button', { name: 'Track Item' }).click()
		await page.getByLabel('Search').fill('Parmesan')
		await searchInternetButton.click()
		await page
			.getByRole('button', { name: 'Parmesan am Stück 1 port. Milbona 402 kcal%g||ml' })
			.click()
		await page.getByRole('button', { name: 'Select' }).click()
		await page.getByRole('textbox', { name: 'Amount' }).fill('40')
		await page.getByRole('button', { name: 'Track' }).click()
		await waitForIngredientDialogClose()

		// Tomate
		await dialog.getByRole('button', { name: 'Track Item' }).click()
		await page.getByLabel('Search').fill('Tomate')
		await searchInternetButton.click()
		await page
			.getByRole('button', { name: 'Tomaten, frisch 4 port. Naturprodukt 19 kcal%g||ml' })
			.click()
		await page.getByRole('button', { name: 'Select' }).click()
		await page.getByRole('button', { name: 'Track 1 mittelgroße (130 g|ml)' }).click()
		await waitForIngredientDialogClose()

		// Knoblauch
		await dialog.getByRole('button', { name: 'Track Item' }).click()
		await page.getByLabel('Search').fill('Knoblauch')
		await searchInternetButton.click()
		await page
			.getByRole('button', { name: 'Knoblauch, frisch 1 port. Naturprodukt 141 kcal%g||ml' })
			.click()
		await page.getByRole('button', { name: 'Select' }).click()
		await page.getByRole('button', { name: 'Track 1 Zehe (3 g|ml)' }).click()
		await waitForIngredientDialogClose()
		// ups, 5 müssen das sein
		await page.getByRole('button', { name: 'Knoblauch, frisch Naturprodukt 4 kcal' }).click()
		await page.getByRole('textbox', { name: 'Amount' }).fill('3*5')
		await page
			.getByTestId('item-instance-editor')
			.getByRole('button', { name: 'Close Dialog or Dialog' })
			.click()

		// Peperoni
		await dialog.getByRole('button', { name: 'Track Item' }).click()
		await page.getByLabel('Search').fill('Peperoni')
		await searchInternetButton.click()
		await page
			.getByRole('button', { name: 'Peperoni, rot 1 port. Naturprodukt 28 kcal%g||ml' })
			.click()
		await page.getByRole('button', { name: 'Select' }).click()
		await page.getByRole('button', { name: 'Track 1 mittelgroße (6 g|ml)' }).click()
		await waitForIngredientDialogClose()
		// ups, 2 müssen das sein
		await page.getByRole('button', { name: 'Peperoni, rot Naturprodukt 2 kcal' }).click()
		await page.getByRole('textbox', { name: 'Amount' }).fill('6*2')
		await page
			.getByTestId('item-instance-editor')
			.getByRole('button', { name: 'Close Dialog or Dialog' })
			.click()

		// Gemüsebrühe
		await dialog.getByRole('button', { name: 'Track Item' }).click()
		await page.getByLabel('Search').fill('Maggi Gemüsebrühe Pulver')
		await searchInternetButton.click()
		await page
			.getByRole('button', { name: 'Maggi Klare Gemüsebrühe Pulver Maggi 172 kcal%g||ml' })
			.click()
		await page.getByRole('button', { name: 'Select' }).click()
		await page.getByRole('textbox', { name: 'Amount' }).fill('30')
		await page.getByRole('button', { name: 'Track' }).click()
		await waitForIngredientDialogClose()

		// Olivenöl
		await dialog.getByRole('button', { name: 'Track Item' }).click()
		await page.getByLabel('Search').fill('Olivenöl')
		await searchInternetButton.click()
		await page.getByRole('button', { name: 'Olivenöl 3 port. Naturprodukt 857 kcal%g||ml' }).click()
		await page.getByRole('button', { name: 'Select' }).click()
		await page.getByRole('button', { name: 'Track' }).click()
		await waitForIngredientDialogClose()

		// Raus hier
		await page.getByRole('button', { name: 'Back' }).click()
		await page.getByRole('button', { name: 'Close Dialog or Dialog' }).click()

		// heute als Dinner tracken
		await page.getByTestId(`track-item-Dinner-${date}`).click()
		await page.getByLabel('Search').fill('Spaghetti')
		await page
			.getByRole('button', { name: `Spaghetti aglio, olio e peperoncino ${date} 335 kcal%g||ml` })
			.click()
		await page.getByLabel('Amount').fill('430')
		await page.getByRole('button', { name: 'Track' }).click()

		const todayDinnerBucket = page.getByTestId(`bucket-Dinner-${date}`)
		let searchText = `Spaghetti aglio, olio e peperoncino`
		expect(await todayDinnerBucket.getByText(searchText).isVisible()).toBeTruthy()
		searchText = date
		expect(await todayDinnerBucket.getByText(searchText).isVisible()).toBeTruthy()
		searchText = '1440 kcal'
		expect(await todayDinnerBucket.getByText(searchText).isVisible()).toBeTruthy()
	})

	test('add quick snack and track it', async ({ page }) => {
		const date = toISODateString(new Date())

		await page.getByTestId(`track-item-Lunch-${date}`).click()
		await page.getByLabel('Search').fill('Oatly Hafer Calcium')
		page.getByRole('button', { name: 'Search for item on internet' }).click()
		await page.getByRole('button', { name: 'Hafer Drink, Calcium Oatly 46 kcal%g||ml' }).click()
		await page.getByRole('button', { name: 'Add Portion' }).click()
		await page.getByLabel('Label').nth(1).fill('Schuss')
		await page.getByLabel('Amount (g||ml)').fill('10')
		await page.getByTestId('add-quick-snack').click()
		await page.getByRole('button', { name: 'Close Dialog or Dialog' }).click()
		await page.getByRole('button', { name: 'Items' }).click()
		await page.getByTestId('quick-snacks').click()
		await page.getByRole('button', { name: 'Hafer Drink, Calcium Schuss Oatly 5 kcal' }).click()
		await page
			.getByRole('button', { name: 'Hafer Drink, Calcium Schuss Oatly 5 kcal' })
			.press('Escape')

		await page.getByTestId(`bucket-button-Snacks-${date}`).click()
		const todaySnackBucket = page.getByTestId(`bucket-Snacks-${date}`)
		let searchText = `Hafer Drink, Calcium`
		expect(await todaySnackBucket.getByText(searchText).isVisible()).toBeTruthy()
		searchText = '5 kcal'
		expect(await todaySnackBucket.getByText(searchText).isVisible()).toBeTruthy()
	})
})
