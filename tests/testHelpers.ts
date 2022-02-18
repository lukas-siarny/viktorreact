import {
	By, Locator, until, WebDriver, Key
} from 'selenium-webdriver'
import slugify from 'slugify'

import { DOMAIN, TIMEOUT } from './global'
import { FORM } from '../src/utils/enums'

export const ANIMATION_TIMEOUT = 200
/**
 * Najde viditelny element na obrazovke,
 * Klikat mozme len na viditelny element, inak test moze skoncit chybou (element is not interactable)
 */
export const findVisibleElement = async (driver: WebDriver, locator: Locator) => {
	const el = await driver.wait(until.elementLocated(locator), TIMEOUT)
	await driver.wait(until.elementIsVisible(el), TIMEOUT)
	return el
}

export const fastLogin = async (driver: WebDriver) => {
	await driver.get(DOMAIN)
	await driver.executeScript('localStorage.setItem(arguments[0],arguments[1])', 'access_token', process.env.token)
}

export const sendKeys = async (driver: WebDriver, fieldID: string, keys: string) => {
	const field = await findVisibleElement(driver, By.id(fieldID))
	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', field)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await field.click()
	await field.sendKeys(keys)
}

export const sendKeysAndEnter = async (driver: WebDriver, fieldID: string, string: string) => {
	const field = await findVisibleElement(driver, By.id(fieldID))
	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', field)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await field.click()
	await field.sendKeys(string)
	await field.sendKeys(Key.ENTER)
}

export const fillDateRangePicker = async (driver: WebDriver, fieldID: string, dateFromKeys: string, dateToKeys: string) => {
	const [inputFrom, inputTo] = await driver.wait(until.elementsLocated(By.css(`#${fieldID} input`)), TIMEOUT)
	await inputFrom.click()
	await inputFrom.sendKeys(dateFromKeys)

	await inputTo.click()
	await inputTo.sendKeys(dateToKeys)
}

export const fillSearchMultiselectByFirstOptionBox = async (driver: WebDriver, fieldID: string, searchString: string) => {
	const field = await driver.wait(until.elementLocated(By.id(fieldID)), TIMEOUT)

	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', field)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await field.click()
	await field.sendKeys(searchString)
	const firstOption = await findVisibleElement(driver, By.css(`#${fieldID}_list + .rc-virtual-list .ant-select-item-option`))
	await driver.executeScript('arguments[0].scrollIntoView({block: "end", inline: "end"})', firstOption)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await firstOption.click()
	await field.sendKeys(Key.ESCAPE)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
}

export const submitForm = async (driver: WebDriver, submitButtonClass: FORM) => {
	const btn = await findVisibleElement(driver, By.className(submitButtonClass))
	await btn.click()
}

export const selectOption = async (driver: WebDriver, fieldID: string, label?: string) => {
	const field = await driver.wait(until.elementLocated(By.id(fieldID)), TIMEOUT)
	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', field)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await field.click()
	let selector = ':first-child'
	if (label) {
		selector = `[label="${label}"]`
	}
	const firstOption = await findVisibleElement(driver, By.css(`#${fieldID}_list + .rc-virtual-list .ant-select-item-option${selector}`))
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await firstOption.click()
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
}

export const selectSearchOption = async (driver: WebDriver, fieldID: string, searchString: string) => {
	const field = await driver.wait(until.elementLocated(By.id(fieldID)), TIMEOUT)
	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', field)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await sendKeys(driver, fieldID, searchString)
	let selector = ':first-child'
	if (searchString) {
		selector = `[label="${searchString}"]`
	}
	const firstOption = await findVisibleElement(driver, By.css(`#${fieldID}_list + .rc-virtual-list .ant-select-item-option${selector}`))
	await driver.executeScript('arguments[0].scrollIntoView({block: "end", inline: "end"})', firstOption)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await firstOption.click()
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
}

export const toggleSwitch = async (driver: WebDriver, fieldID: string) => {
	const field = await driver.wait(until.elementLocated(By.id(fieldID)), TIMEOUT)
	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', field)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await field.click()
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
}

export const spinningIsRemoved = async (driver: WebDriver, spinOverlayClass: string) => {
	try {
		const overlay = await driver.wait(until.elementLocated(By.className(spinOverlayClass)), TIMEOUT, undefined, 100)
		await driver.wait(until.stalenessOf(overlay), TIMEOUT)
	} catch (e) {
		if (e.name === 'TimeoutError') {
			// NOTE: spinner sa nestihol zamerat alebo sa uz nenachadza v DOM, pokracuj bez chyby (moze sa stat ze sa caka 2x TIMEOUT)
			return
		}
		throw e
	}
}

export const notificationIsSuccess = async (driver: WebDriver) => {
	const closeIcon = await driver.wait(until.elementLocated(By.css('.ant-notification-notice-success .ant-notification-notice-close')), TIMEOUT)
	await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMEOUT))
	await closeIcon.click()

	// https://github.com/SeleniumHQ/selenium/issues/5476#issuecomment-364603482
	await driver.wait(until.stalenessOf(closeIcon), TIMEOUT)
}

export const createTestSelector = (selector: string) => `TEST-${slugify(selector, { remove: /[()]/ })}`
