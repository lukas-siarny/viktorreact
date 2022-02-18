import 'chromedriver'
import { By, until, WebDriver } from 'selenium-webdriver'
import dayjs from 'dayjs'
import faker from 'faker'
import { reduce } from 'lodash'

import { ENUMERATIONS_KEYS, FORM, PAGE_ACCOMMODATION_FACILITY_TABS, PAGE_DESTINATION_SEASON_TABS, PAGE_LINE_TABS, SERVICE_TYPE, TAB_ID_PREFIX } from '../../../src/utils/enums'
import { DOMAIN, setupDriver, TIMEOUT } from '../../global'
import {
	fastLogin,
	sendKeysAndEnter,
	fillSearchMultiselectByFirstOptionBox,
	notificationIsSuccess,
	selectOption,
	selectSearchOption,
	sendKeys,
	submitForm,
	createTestSelector,
	ANIMATION_TIMEOUT,
	toggleSwitch,
	spinningIsRemoved,
	fillDateRangePicker
} from '../../testHelpers'

const seasonYear = dayjs().format('YYYY')

const testData = {
	season: {
		dateFrom: dayjs(seasonYear, 'YYYY').startOf('year').format('DD.MM.YYYY'),
		dateTo: dayjs(seasonYear, 'YYYY').endOf('year').format('DD.MM.YYYY'),
		name: seasonYear
	},
	terrmSerial: {
		name: faker.lorem.words(2),
		termPrefix: faker.random.alphaNumeric(5)
	},
	destinationSeason: {
		name: faker.random.alphaNumeric(10),
		destinationSearch: 'Egypt',
		seasonSearch: seasonYear
	},
	productCatalogue: {
		name: faker.lorem.words(2)
	},
	productType: {
		name: faker.lorem.words(2)
	},
	stationsAir: [
		{
			code: faker.random.alphaNumeric(4),
			type: 'Letecká',
			name: faker.lorem.words(2),
			destinationSearch: 'Slovensko'
		},
		{
			code: faker.random.alphaNumeric(4),
			type: 'Letecká',
			name: faker.lorem.words(2),
			destinationSearch: 'Egypt'
		}
	],
	stationsBus: [
		{
			code: faker.random.alphaNumeric(4),
			type: 'Autobusová',
			name: faker.lorem.words(2),
			destinationSearch: 'Slovensko'
		},
		{
			code: faker.random.alphaNumeric(5),
			type: 'Autobusová',
			name: faker.lorem.words(2),
			destinationSearch: 'Egypt'
		}
	],
	facilities: [
		{
			name: faker.lorem.words(2),
			type: 'aparthotel',
			categoryOfficial: '⭑⭑⭑',
			categoryOur: '☀☀☀+',
			unitTemplates: [
				{
					name: 'Jednolôžková izba',
					capacity: 10,
					priceListItems: [
						{
							name: 'Osoba na základnom lôžku',
							type: 'Fixná suma',
							price: 200
						}
					]
				}
			]
		}
	],
	airLines: [
		{
			code: faker.random.alphaNumeric(8),
			direction: 'Tam',
			connectionType: 'Charterová linka',
			unitTemplates: [
				{
					name: 'AIR STANDARD CLASS',
					capacity: 10,
					priceListItems: [
						{
							name: 'Doprava pre dospelého',
							type: 'Fixná suma',
							price: 100
						}
					]
				}
			]
		},
		{
			code: faker.random.alphaNumeric(8),
			direction: 'Späť',
			connectionType: 'Charterová linka',
			unitTemplates: [
				{
					name: 'AIR STANDARD CLASS',
					capacity: 10,
					priceListItems: [
						{
							name: 'Doprava pre dospelého',
							type: 'Fixná suma',
							price: 150
						}
					]
				}
			]
		}
	],
	carrier: {
		name: faker.lorem.words(2)
	},
	airService: {
		name: faker.lorem.words(2)
	},
	reservation: {
		destinationSearch: 'Egypt',
		termsSearch: {
			dateFrom: dayjs().format('DD.MM.YYYY'),
			dateTo: dayjs(seasonYear, 'YYYY').endOf('year').format('DD.MM.YYYY')
		},
		product: {
			term: {
				// TODO: BACKLOG scrollovat vo vyhladavani na posledny termin sezony ?
				dateFrom: dayjs().format('YYYY-MM-DD'),
				dateTo: dayjs().add(7, 'days').format('YYYY-MM-DD')
			}
		}
	}
}

export const createDestinationSeason = async (driver: WebDriver) => {
	await driver.get(`${DOMAIN}/produkty/destinacia-na-sezonu/vytvorit`)

	await sendKeys(driver, `${FORM.DESTINATION_SEASON_FORM}-name`, testData.destinationSeason.name)

	await selectSearchOption(driver, `${FORM.DESTINATION_SEASON_FORM}-destinationID`, testData.destinationSeason.destinationSearch)

	await selectOption(driver, `${FORM.DESTINATION_SEASON_FORM}-seasonID`, testData.season.name)

	await fillSearchMultiselectByFirstOptionBox(driver, `${FORM.DESTINATION_SEASON_FORM}-productTypeIDs`, testData.productType.name)

	await fillSearchMultiselectByFirstOptionBox(driver, `${FORM.DESTINATION_SEASON_FORM}-productCatalogueIDs`, testData.productCatalogue.name)

	await submitForm(driver, FORM.DESTINATION_SEASON_FORM)
	await notificationIsSuccess(driver)
}

export const createProductCatalogue = async (driver: WebDriver) => {
	await driver.get(`${DOMAIN}/inventar/ciselniky/{{enumerationType}}`.replace('{{enumerationType}}', ENUMERATIONS_KEYS.PRODUCT_CATALOGUES))

	await sendKeys(driver, `${FORM.ENUMERATION_FORM}-name`, testData.productCatalogue.name)
	await submitForm(driver, FORM.ENUMERATION_FORM)
	await notificationIsSuccess(driver)
}

export const createProductType = async (driver: WebDriver) => {
	await driver.get(`${DOMAIN}/inventar/ciselniky/{{enumerationType}}`.replace('{{enumerationType}}', ENUMERATIONS_KEYS.PRODUCT_TYPES))

	await sendKeys(driver, `${FORM.ENUMERATION_FORM}-name`, testData.productType.name)
	await submitForm(driver, FORM.ENUMERATION_FORM)
	await notificationIsSuccess(driver)
}

const createSeason = async (driver: WebDriver) => {
	await driver.get(`${DOMAIN}/inventar/ciselniky/{{enumerationType}}`.replace('{{enumerationType}}', ENUMERATIONS_KEYS.SEASONS))

	await sendKeys(driver, `${FORM.ENUMERATION_FORM}-name`, testData.season.name)

	await sendKeysAndEnter(driver, `${FORM.ENUMERATION_FORM}-dateFrom`, testData.season.dateFrom)
	await sendKeysAndEnter(driver, `${FORM.ENUMERATION_FORM}-dateTo`, testData.season.dateTo)

	await submitForm(driver, FORM.ENUMERATION_FORM)
	await notificationIsSuccess(driver)
}

const createTermSerialForDestinationSeason = async (driver: WebDriver) => {
	const tab = await driver.wait(until.elementLocated(By.id(createTestSelector(`${TAB_ID_PREFIX}-tab-${PAGE_DESTINATION_SEASON_TABS.TERMS}`))), TIMEOUT)
	await tab.click()
	const btnAddTermSerial = await driver.wait(until.elementLocated(By.id('ADD-TERM-SERIAL')), TIMEOUT)
	await btnAddTermSerial.click()

	await sendKeys(driver, `${FORM.TERM_SERIALS_FORM}-name`, testData.destinationSeason.name)
	await sendKeys(driver, `${FORM.TERM_SERIALS_FORM}-termPrefix`, testData.terrmSerial.termPrefix)
	await submitForm(driver, FORM.TERM_SERIALS_FORM)
	await notificationIsSuccess(driver)
}

const createTermsForDestinationSeason = async (driver: WebDriver) => {
	const btnAddTerms = await driver.wait(until.elementLocated(By.id('ADD-TERMS')), TIMEOUT)
	await btnAddTerms.click()
	await submitForm(driver, FORM.TERMS_FORM)
	await notificationIsSuccess(driver)
}

const createAirLine = async (driver: WebDriver) => {
	await reduce(
		testData.airLines,
		(promise, airLine) =>
			promise.then(async () => {
				await driver.get(`${DOMAIN}/inventar/letecka-doprava/vytvorit`)

				await sendKeys(driver, `${FORM.TRANSPORT_INFO_FORM}-code`, airLine.code)

				await selectOption(driver, `${FORM.TRANSPORT_INFO_FORM}-direction`, airLine.direction)
				const stations = [...testData.stationsAir]

				if (airLine.direction === 'Späť') {
					stations.reverse()
				}
				await selectSearchOption(driver, `${FORM.TRANSPORT_INFO_FORM}-startStation`, stations[0].name)

				await selectSearchOption(driver, `${FORM.TRANSPORT_INFO_FORM}-endStation`, stations[1].name)

				await selectOption(driver, `${FORM.TRANSPORT_INFO_FORM}-connectionType`, airLine.connectionType)

				await selectSearchOption(driver, `${FORM.TRANSPORT_INFO_FORM}-carrier`, testData.carrier.name)

				await submitForm(driver, FORM.TRANSPORT_INFO_FORM)
				await notificationIsSuccess(driver)

				// NOTE: ASSING UNIT TEMPATE
				const tab = await driver.wait(until.elementLocated(By.id(createTestSelector(`${TAB_ID_PREFIX}-tab-${PAGE_LINE_TABS.LINE_UNIT_TEMPLATES_TAB}`))), TIMEOUT)
				await tab.click()

				await reduce(
					[...airLine.unitTemplates],
					(prevPromise, unitTemplate) =>
						prevPromise.then(async () => {
							await selectOption(driver, `${FORM.ADD_UNIT_TEMPLATE_FORM}-unitTemplateID`, unitTemplate.name)
							await notificationIsSuccess(driver)
						}),
					Promise.resolve()
				)
			}),
		Promise.resolve()
	)
}

const createStations = async (driver: WebDriver) => {
	await reduce(
		[...testData.stationsAir, ...testData.stationsBus],
		(promise, station) =>
			promise.then(async () => {
				await driver.get(`${DOMAIN}/inventar/ciselniky/{{enumerationType}}`.replace('{{enumerationType}}', ENUMERATIONS_KEYS.STATIONS))
				await sendKeys(driver, `${FORM.ENUMERATION_FORM}-name`, station.name)

				await sendKeys(driver, `${FORM.ENUMERATION_FORM}-code`, station.code)

				await selectOption(driver, `${FORM.ENUMERATION_FORM}-type`, station.type)

				await selectSearchOption(driver, `${FORM.ENUMERATION_FORM}-destinationID`, station.destinationSearch)

				await submitForm(driver, FORM.ENUMERATION_FORM)
				await notificationIsSuccess(driver)
			}),
		Promise.resolve()
	)
}

const createCarrier = async (driver: WebDriver) => {
	await driver.get(`${DOMAIN}/inventar/ciselniky/{{enumerationType}}`.replace('{{enumerationType}}', ENUMERATIONS_KEYS.CARRIERS))

	await sendKeys(driver, `${FORM.ENUMERATION_FORM}-name`, testData.carrier.name)

	await submitForm(driver, FORM.ENUMERATION_FORM)
	await notificationIsSuccess(driver)
}

const assignAirLineStep1 = async (driver: WebDriver) => {
	const tab = await driver.wait(until.elementLocated(By.id(createTestSelector(`${TAB_ID_PREFIX}-tab-${PAGE_DESTINATION_SEASON_TABS.TRANSPORTATION}`))), TIMEOUT)
	await tab.click()

	const btn = await driver.wait(until.elementLocated(By.id(createTestSelector(`assign-${SERVICE_TYPE.TRANSPORTATION}`))), TIMEOUT)
	await btn.click()

	const dropdown = await driver.wait(until.elementLocated(By.css('.ant-dropdown-menu-title-content div[data-label="Letecká doprava"]')), TIMEOUT)
	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})
	await dropdown.click()

	await sendKeys(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_1_FORM}-name`, testData.airService.name)

	await selectSearchOption(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_1_FORM}-lineForth`, testData.airLines[0].code)

	await selectSearchOption(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_1_FORM}-lineBack`, testData.airLines[1].code)

	await submitForm(driver, FORM.TRANSPORTATION_SERVICE_STEP_1_FORM)
	await notificationIsSuccess(driver)
}

const assignAirLineStep2 = async (driver: WebDriver) => {
	const bulkCheckbox = await driver.wait(until.elementLocated(By.name('bulk-generate')), TIMEOUT)

	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})

	await bulkCheckbox.click()

	await submitForm(driver, FORM.TRANSPORTATION_SERVICE_STEP_2_FORM)
	await notificationIsSuccess(driver)
}

const assignAirLineStep3 = async (driver: WebDriver) => {
	await selectOption(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_3_FORM}-departureShift`, 'Odlet v deň ubytovania')
	await selectOption(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_3_FORM}-arrivalShift`, 'Prílet v deň ubytovania')

	await sendKeysAndEnter(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_3_FORM}-forthRoadsOptions-departureTime`, '10:00')

	await sendKeysAndEnter(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_3_FORM}-forthRoadsOptions-arrivalTime`, '13:00')
	await sendKeysAndEnter(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_3_FORM}-backRoadsOptions-departureTime`, '11:00')
	await sendKeysAndEnter(driver, `${FORM.TRANSPORTATION_SERVICE_STEP_3_FORM}-backRoadsOptions-arrivalTime`, '14:00')

	await submitForm(driver, FORM.TRANSPORTATION_SERVICE_STEP_3_FORM)
	await notificationIsSuccess(driver)
}

const assignUnitTemplateToAirLine = async (driver: WebDriver) => {
	const airLine = testData.airLines[0]
	const btn = await driver.wait(until.elementLocated(By.id(createTestSelector(`assign-${FORM.SERVICE_UNIT_TEMPLATE_FORM}`))), TIMEOUT)
	await btn.click()
	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})
	await selectOption(driver, `${FORM.SERVICE_UNIT_TEMPLATE_FORM}-step1-0-unitTemplate`, airLine.unitTemplates[0].name)
	// NOTE: submit step 1
	await submitForm(driver, FORM.SERVICE_UNIT_TEMPLATE_FORM)
	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})
	// NOTE: submit step 2
	await submitForm(driver, FORM.SERVICE_UNIT_TEMPLATE_FORM)
	await notificationIsSuccess(driver)

	// NOTE: fill capacity for every term
	await sendKeysAndEnter(driver, createTestSelector(`${airLine.code}-${airLine.unitTemplates[0].name}-capacity-bulk`), `${airLine.unitTemplates[0].capacity}`)
	await notificationIsSuccess(driver)

	// NOTE: fill capacity for back direction
	const [, tab] = await driver.wait(until.elementsLocated(By.css(`#${createTestSelector(`${TAB_ID_PREFIX}_line`)} .ant-tabs-tab-btn`)), TIMEOUT)
	await tab.click()
	const unitTemplateCode = await tab.findElement(By.css('.ant-typography')).getText()
	const unitTemplateData = testData.airLines.find((item) => {
		const itemName = `${item.code} (${item.unitTemplates[0].name})`
		return itemName === unitTemplateCode && item.direction === 'Späť'
	})
	await sendKeysAndEnter(
		driver,
		createTestSelector(`${unitTemplateData.code}-${unitTemplateData.unitTemplates[0].name}-capacity-bulk`),
		`${unitTemplateData.unitTemplates[0].capacity}`
	)
	await notificationIsSuccess(driver)
}

const assignUnitTemplateToFacility = async (driver: WebDriver) => {
	await reduce(
		testData.facilities,
		(acc, facility) =>
			acc.then(async () => {
				const btn = await driver.wait(until.elementLocated(By.id(createTestSelector(`assign-${FORM.SERVICE_UNIT_TEMPLATE_FORM}`))), TIMEOUT)
				await btn.click()
				await new Promise((resolve) => {
					setTimeout(resolve, ANIMATION_TIMEOUT)
				})
				await selectOption(driver, `${FORM.SERVICE_UNIT_TEMPLATE_FORM}-step1-0-unitTemplate`, facility.unitTemplates[0].name)
				// NOTE: submit step 1
				await submitForm(driver, FORM.SERVICE_UNIT_TEMPLATE_FORM)
				await new Promise((resolve) => {
					setTimeout(resolve, ANIMATION_TIMEOUT)
				})
				// NOTE: submit step 2
				await submitForm(driver, FORM.SERVICE_UNIT_TEMPLATE_FORM)
				await notificationIsSuccess(driver)

				// NOTE: fill capacity for every term
				await sendKeysAndEnter(driver, createTestSelector(`${facility.unitTemplates[0].name}-capacity-bulk`), `${facility.unitTemplates[0].capacity}`)

				await notificationIsSuccess(driver)
			}),
		Promise.resolve()
	)
}

const assignPriceListItemToAirLine = async (driver: WebDriver) => {
	const tabs = await driver.wait(until.elementsLocated(By.css(`#${createTestSelector(`${TAB_ID_PREFIX}_line`)} .ant-tabs-tab-btn`)), TIMEOUT)

	await tabs.reduce(
		(acc, tab) =>
			acc.then(async () => {
				await tab.findElement(By.css('button')).click()
				const unitTemplateCode = await tab.findElement(By.css('.ant-typography')).getText()
				await new Promise((resolve) => {
					setTimeout(resolve, ANIMATION_TIMEOUT)
				})

				// NOTE: it should iterate through item.unitTemplates
				const unitTemplateData = testData.airLines.find((item) => {
					const itemName = `${item.code} (${item.unitTemplates[0].name})`
					return itemName === unitTemplateCode
				})

				const dropdown = await driver.wait(
					until.elementLocated(
						By.css(
							`.ant-dropdown.${createTestSelector(
								`${unitTemplateData.code} (${unitTemplateData.unitTemplates[0].name})`
							)} div[data-label="Priradiť cenníkovú položku"]`
						)
					),
					TIMEOUT
				)
				await dropdown.click()

				await selectSearchOption(driver, `${FORM.SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM}-pricelistItem`, unitTemplateData.unitTemplates[0].priceListItems[0].name)

				await selectOption(driver, `${FORM.SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM}-type`, unitTemplateData.unitTemplates[0].priceListItems[0].type)

				// NOTE: step 1
				await submitForm(driver, FORM.SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM)

				// NOTE: step 2
				await submitForm(driver, FORM.SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM)
				await notificationIsSuccess(driver)
				await new Promise((resolve) => {
					setTimeout(resolve, ANIMATION_TIMEOUT)
				})

				// NOTE: fill capacity for every term
				await sendKeysAndEnter(
					driver,
					createTestSelector(`${unitTemplateData.code}-${unitTemplateData.unitTemplates[0].name}-${unitTemplateData.unitTemplates[0].priceListItems[0].name}-price-bulk`),
					`${unitTemplateData.unitTemplates[0].priceListItems[0].price}`
				)
				await notificationIsSuccess(driver)
			}),
		Promise.resolve()
	)
}

const publishPrice = async (driver: WebDriver) => {
	const btn = await driver.wait(until.elementLocated(By.id(createTestSelector('publish-price'))), TIMEOUT)
	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', btn)
	await btn.click()
	await notificationIsSuccess(driver)
}

const assignFacility = async (driver: WebDriver) => {
	const tab = await driver.wait(until.elementLocated(By.id(createTestSelector(`${TAB_ID_PREFIX}-tab-${PAGE_DESTINATION_SEASON_TABS.FACILITY}`))), TIMEOUT)
	await tab.click()

	const btn = await driver.wait(until.elementLocated(By.id(createTestSelector(`assign-${SERVICE_TYPE.FACILITY}`))), TIMEOUT)
	await btn.click()

	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})

	await selectSearchOption(driver, `${FORM.ASSIGN_FACILITY_SERVICE_FORM}-facility`, testData.facilities[0].name)

	await submitForm(driver, FORM.ASSIGN_FACILITY_SERVICE_FORM)
	await notificationIsSuccess(driver)
}

const createFacility = async (driver: WebDriver) => {
	await reduce(
		testData.facilities,
		(promise, facility) =>
			promise.then(async () => {
				await driver.get(`${DOMAIN}/inventar/ubytovacie-zariadenia/vytvorit`)

				await spinningIsRemoved(driver, createTestSelector(`${FORM.ACCOMMODATION_FACILITY_INFO_FORM}-spinning`))

				await sendKeys(driver, `${FORM.ACCOMMODATION_FACILITY_INFO_FORM}-name`, facility.name)

				await selectSearchOption(driver, `${FORM.ACCOMMODATION_FACILITY_INFO_FORM}-destinationID`, testData.destinationSeason.destinationSearch)

				await selectOption(driver, `${FORM.ACCOMMODATION_FACILITY_INFO_FORM}-facilityTypeID`, facility.type)

				await selectOption(driver, `${FORM.ACCOMMODATION_FACILITY_INFO_FORM}-facilityCategoryOfficial`, facility.categoryOfficial)

				await selectOption(driver, `${FORM.ACCOMMODATION_FACILITY_INFO_FORM}-facilityCategoryOur`, facility.categoryOur)

				await submitForm(driver, FORM.ACCOMMODATION_FACILITY_INFO_FORM)
				await notificationIsSuccess(driver)

				// NOTE: ASSING UNIT TEMPATE
				const tab = await driver.wait(
					until.elementLocated(By.id(createTestSelector(`${TAB_ID_PREFIX}-tab-${PAGE_ACCOMMODATION_FACILITY_TABS.ACCOMMODATION_FACILITY_UNIT_TEMPLATES_TAB}`))),
					TIMEOUT
				)
				await tab.click()

				await reduce(
					[...facility.unitTemplates],
					(prevPromise, unitTemplate) =>
						prevPromise.then(async () => {
							await selectOption(driver, `${FORM.ADD_UNIT_TEMPLATE_FORM}-unitTemplateID`, unitTemplate.name)
							await notificationIsSuccess(driver)
						}),
					Promise.resolve()
				)
			}),
		Promise.resolve()
	)
}

const assignPriceListItemToFacility = async (driver: WebDriver) => {
	const tabs = await driver.wait(until.elementsLocated(By.css(`#${createTestSelector(`${TAB_ID_PREFIX}_line`)} .ant-tabs-tab-btn`)), TIMEOUT)

	await tabs.reduce(
		(acc, tab) =>
			acc.then(async () => {
				await tab.findElement(By.css('button')).click()
				const unitTemplateCode = await tab.findElement(By.css('.ant-typography')).getText()
				await new Promise((resolve) => {
					setTimeout(resolve, ANIMATION_TIMEOUT)
				})

				// NOTE: it should iterate through item.unitTemplates
				const unitTemplateData = testData.facilities.find((item) => {
					const itemName = item.unitTemplates[0].name
					return itemName === unitTemplateCode
				})

				const unitTemplateName = unitTemplateData.unitTemplates[0].name

				const dropdown = await driver.wait(
					until.elementLocated(By.css(`.ant-dropdown.${createTestSelector(unitTemplateName)} div[data-label="Priradiť cenníkovú položku"]`)),
					TIMEOUT
				)
				await dropdown.click()

				await selectSearchOption(driver, `${FORM.SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM}-pricelistItem`, unitTemplateData.unitTemplates[0].priceListItems[0].name)

				await selectOption(driver, `${FORM.SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM}-type`, unitTemplateData.unitTemplates[0].priceListItems[0].type)

				// NOTE: step 1
				await submitForm(driver, FORM.SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM)

				// NOTE: step 2
				await submitForm(driver, FORM.SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM)
				await notificationIsSuccess(driver)
				await new Promise((resolve) => {
					setTimeout(resolve, ANIMATION_TIMEOUT)
				})

				// NOTE: fill capacity for every term
				await sendKeysAndEnter(
					driver,
					createTestSelector(`${unitTemplateData.unitTemplates[0].name}-${unitTemplateData.unitTemplates[0].priceListItems[0].name}-price-bulk`),
					`${unitTemplateData.unitTemplates[0].priceListItems[0].price}`
				)
				await notificationIsSuccess(driver)
			}),
		Promise.resolve()
	)
}

const publishDestinationSeason = async (driver: WebDriver) => {
	const tab = await driver.wait(until.elementLocated(By.id(createTestSelector(`${TAB_ID_PREFIX}-tab-${PAGE_DESTINATION_SEASON_TABS.INFO}`))), TIMEOUT)
	await tab.click()

	await spinningIsRemoved(driver, createTestSelector(`${FORM.DESTINATION_SEASON_FORM}-spinning`))
	await toggleSwitch(driver, `${FORM.DESTINATION_SEASON_FORM}-published`)

	await submitForm(driver, FORM.DESTINATION_SEASON_FORM)
	await notificationIsSuccess(driver)
}

const reservationStep0 = async (driver: WebDriver) => {
	await driver.get(`${DOMAIN}/predaj/vyhladavanie`)
	await fillSearchMultiselectByFirstOptionBox(driver, `${FORM.PRODUCTS_FILTER}-destinations`, testData.reservation.destinationSearch)
	await fillDateRangePicker(driver, `${FORM.PRODUCTS_FILTER}-term-range`, testData.reservation.termsSearch.dateFrom, testData.reservation.termsSearch.dateTo)
	await submitForm(driver, FORM.PRODUCTS_FILTER)

	// add transportation
	// TODO: Do selectora zahrnut aj udaj konkretnej destinacie
	const transportationSelector = createTestSelector(
		`assign-TRANSPORTATION-${testData.reservation.product.term.dateFrom}-${testData.reservation.product.term.dateTo}-${testData.stationsAir[0].name}-${testData.airLines[0].unitTemplates[0].name}`
	)
	const transportationName = await driver.wait(until.elementLocated(By.id(transportationSelector)), TIMEOUT)
	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', transportationName)
	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})
	transportationName.click()
	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})
	const btn1 = await driver.wait(until.elementLocated(By.id(createTestSelector('submit-product-drawer'))), TIMEOUT)
	await btn1.click()

	// add accomodation and rooms occupancy
	// TODO: Do selectora zahrnut aj udaj konkretnej destinacie
	const accomodationSelector = createTestSelector(
		`assign-FACILITY-${testData.reservation.product.term.dateFrom}-${testData.reservation.product.term.dateTo}-${testData.facilities[0].unitTemplates[0].name}`
	)
	const accomodationName = await driver.wait(until.elementLocated(By.id(accomodationSelector)), TIMEOUT)
	await driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"})', accomodationName)
	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})
	accomodationName.click()
	await new Promise((resolve) => {
		setTimeout(resolve, ANIMATION_TIMEOUT)
	})
	const btn2 = await driver.wait(until.elementLocated(By.id(createTestSelector('submit-product-drawer'))), TIMEOUT)
	await btn2.click()
}

describe('create.DestinationSeason', () => {
	it('can create.Enumerations.ProductCatalogue', () =>
		setupDriver(async (driver: WebDriver) => {
			await fastLogin(driver)
			await createProductCatalogue(driver)
		}))

	it('can create.Enumerations.ProductType', () =>
		setupDriver(async (driver) => {
			await fastLogin(driver)
			await createProductType(driver)
		}))

	it('can create.Enumerations.Season', () =>
		setupDriver(async (driver) => {
			await fastLogin(driver)
			await createSeason(driver)
		}))

	it('can create.Enumerations.Stations', () =>
		setupDriver(async (driver) => {
			await fastLogin(driver)
			await createStations(driver)
		}))

	it('can create.Enumerations.Carriers', () =>
		setupDriver(async (driver) => {
			await fastLogin(driver)
			await createCarrier(driver)
		}))

	it('can create.AirLine', () =>
		setupDriver(async (driver) => {
			await fastLogin(driver)
			await createAirLine(driver)
		}))

	it('can create.Facility', () =>
		setupDriver(async (driver) => {
			await fastLogin(driver)
			await createFacility(driver)
		}))

	it('can create.DestinationSeason', () =>
		setupDriver(async (driver) => {
			await fastLogin(driver)
			await createDestinationSeason(driver)
			await createTermSerialForDestinationSeason(driver)
			await createTermsForDestinationSeason(driver)
			await assignAirLineStep1(driver)
			await assignAirLineStep2(driver)
			await assignAirLineStep3(driver)
			await assignUnitTemplateToAirLine(driver)
			await assignPriceListItemToAirLine(driver)
			await publishPrice(driver)
			await assignFacility(driver)
			await assignUnitTemplateToFacility(driver)
			await assignPriceListItemToFacility(driver)
			await publishPrice(driver)
			await publishDestinationSeason(driver)
		})).timeout(1000 * 60 * 3) // 3min

	it('can create.Reservation', () =>
		setupDriver(async (driver) => {
			await fastLogin(driver)
			await reservationStep0(driver)
			throw new Error('keep browser opened')
		}))
})
