import 'chromedriver'
import { By, until, WebDriver } from 'selenium-webdriver'
import { ADMIN_EMAIL, ADMIN_PWD, DOMAIN, setupDriver, TIMEOUT } from '../../global'
import { FORM } from '../../../src/utils/enums'
import { sendKeys, submitForm } from '../../testHelpers'

// eslint-disable-next-line import/prefer-default-export
export const loginAsAdminFlow = async (driver: WebDriver) => {
	await driver.get(DOMAIN)

	await sendKeys(driver, `${FORM.LOGIN}-email`, ADMIN_EMAIL)
	await sendKeys(driver, `${FORM.LOGIN}-password`, ADMIN_PWD)
	await submitForm(driver, FORM.LOGIN)

	// NOTE: Overenie ci doslo k spristupneniu uvodnej obrazovky pre prihlaseneho pouzivatela
	await driver.wait(until.elementLocated(By.id('header-container')), TIMEOUT)
	return true
}

// https://sqa.stackexchange.com/a/22862
describe('loginAsAdmin', () => {
	it('can login as admin', () =>
		setupDriver(async (driver) => {
			await loginAsAdminFlow(driver)
		}))
})
