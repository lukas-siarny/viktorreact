import { Builder, ThenableWebDriver } from 'selenium-webdriver'
import axios from 'axios'
import { Options as ChromeOptions } from 'selenium-webdriver/chrome'
import { expect } from 'chai'

export const TIMEOUT = 4000
export const DOMAIN = 'http://localhost:3000'

// TODO: pouzit credentials pre produkcne seedy, nesmu tu byt hardcodnute
export const ADMIN_EMAIL = 'lubomir.igonda@goodrequest.com'
export const ADMIN_PWD = 'Lopaty123.'
export const mochaGlobalSetup = async () => {
	const res: any = await axios.post(`${DOMAIN}/api/v1/authorization/login`, { email: ADMIN_EMAIL, password: ADMIN_PWD })
	process.env.token = res?.data?.accessToken
}

export const setupDriver = async (fn: (driver: ThenableWebDriver) => void) => {
	const options = new ChromeOptions()
	options.addArguments('--auto-open-devtools-for-tabs')

	const driver = new Builder()
		.forBrowser('firefox')
		// .forBrowser('chrome')
		.setChromeOptions(options)
		.build()

	await driver.manage().window().maximize()

	try {
		await fn(driver)
		await driver.quit()
	} catch (e) {
		expect(1).equal(e)
		// NOTE: let the browser open for better debugging
		// await driver.quit()
	}
}
