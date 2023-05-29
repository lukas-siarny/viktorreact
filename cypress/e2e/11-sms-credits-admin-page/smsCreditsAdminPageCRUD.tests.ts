import dayjs from 'dayjs'
import { loginViaApi } from '../../support/e2e'

import smsUnitPrices from '../../fixtures/smsUnitPrices.json'
import smsCredit from '../../fixtures/smsCredit.json'

// enums
import {
	CREATE_BUTTON_ID,
	FILTER_BUTTON_ID,
	FORM,
	RECHARGE_SMS_CREDIT_BUTTON_ID,
	RECHARGE_SMS_CREDIT_CONTINUE_BUTTON_ID,
	SMS_TIME_STATS_COUNTRY_PICKER_ID,
	SMS_TIME_STATS_DATE_PICKER_ID,
	SMS_UNIT_PRICES_TABLE_ID,
	SUBMIT_BUTTON_ID
} from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const smsCreditsAdminPageCRUDTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	let smsPriceUnitId: any

	before(() => {
		loginViaApi(email, password)
	})

	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	context('Sms Unit Prices', () => {
		it('Create SMS unit price', () => {
			cy.visit('/sms-credits')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/sms-unit-prices/actual'
				}).as('getSmsUnitPricesActual')
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/enums/sms-unit-prices/'
				}).as('createSmsUnitPrice')
				cy.wait('@getSmsUnitPricesActual').then((interceptionGetSmsPricesActual: any) => {
					// check status code of request
					expect(interceptionGetSmsPricesActual.response.statusCode).to.equal(200)
					cy.wait(5000)
					// NOTE: at least one SMS unit price should exists in DB
					cy.get(`.${SMS_UNIT_PRICES_TABLE_ID}:first`).click()
					cy.clickButton(CREATE_BUTTON_ID, FORM.SMS_UNIT_PRICES_FORM)
					cy.setInputValue(FORM.SMS_UNIT_PRICES_FORM, 'amount', smsUnitPrices.create.amount)
					// NOTE: SMS unit price cannot exist in DB for specified date
					const now = dayjs()
					const dateValue = now.add(1, 'month').format('YYYY-MM')
					cy.setDateInputValue(FORM.SMS_UNIT_PRICES_FORM, 'validFrom', dateValue, now.month() === 11)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.SMS_UNIT_PRICES_FORM)
					cy.wait('@createSmsUnitPrice').then((interceptionCreate: any) => {
						// check status code of request
						expect(interceptionCreate.response.statusCode).to.equal(200)
						smsPriceUnitId = interceptionCreate.response.body.smsUnitPrice.id
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Update SMS unit price', () => {
			cy.visit('/sms-credits')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/sms-unit-prices/actual'
				}).as('getSmsUnitPricesActual')
				cy.wait('@getSmsUnitPricesActual').then((interceptionGetSmsPricesActual: any) => {
					// check status code of request
					expect(interceptionGetSmsPricesActual.response.statusCode).to.equal(200)
					cy.wait(5000)
					// NOTE: at least one SMS unit price should exists in DB
					cy.get(`.${SMS_UNIT_PRICES_TABLE_ID}:first`)
						.as('detailRow')
						.invoke('attr', 'data-row-key')
						.then((dataRowKey) => {
							const countryCode = dataRowKey || ''

							cy.intercept({
								method: 'GET',
								pathname: '/api/b2b/admin/enums/sms-unit-prices/',
								query: {
									countryCode
								}
							}).as('getSmsUnitPrices')
							cy.intercept({
								method: 'PATCH',
								url: `api/b2b/admin/enums/sms-unit-prices/${smsPriceUnitId}`
							}).as('updateSmsUnitPrice')

							cy.get('@detailRow').click()
							cy.wait('@getSmsUnitPrices').then((interceptionGetSmsPrices: any) => {
								// check status code of request
								expect(interceptionGetSmsPrices.response.statusCode).to.equal(200)
								cy.get(`[data-row-key="${smsPriceUnitId}"]`).click()
								cy.setInputValue(FORM.SMS_UNIT_PRICES_FORM, 'amount', smsUnitPrices.update.amount, undefined, true)
								// NOTE: SMS unit price cannot exist in DB for specified date
								const now = dayjs()
								const dateValueUpdate = now.add(2, 'month').format('YYYY-MM')
								cy.setDateInputValue(FORM.SMS_UNIT_PRICES_FORM, 'validFrom', dateValueUpdate, now.month() >= 10)
								cy.clickButton(SUBMIT_BUTTON_ID, FORM.SMS_UNIT_PRICES_FORM)
								cy.wait('@updateSmsUnitPrice').then((interceptionCreate: any) => {
									// check status code of request
									expect(interceptionCreate.response.statusCode).to.equal(200)
									// check conf toast message
									cy.checkSuccessToastMessage()
								})
							})
						})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Delete SMS unit price', () => {
			cy.visit('/sms-credits')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/sms-unit-prices/actual'
				}).as('getSmsUnitPricesActual')
				cy.wait('@getSmsUnitPricesActual').then((interceptionGetSmsPricesActual: any) => {
					// check status code of request
					expect(interceptionGetSmsPricesActual.response.statusCode).to.equal(200)
					cy.wait(5000)
					// NOTE: at least one SMS unit price should exists in DB
					cy.get(`.${SMS_UNIT_PRICES_TABLE_ID}:first`)
						.as('detailRow')
						.invoke('attr', 'data-row-key')
						.then((dataRowKey) => {
							const countryCode = dataRowKey || ''

							cy.intercept({
								method: 'GET',
								pathname: '/api/b2b/admin/enums/sms-unit-prices/',
								query: {
									countryCode
								}
							}).as('getSmsUnitPrices')
							cy.intercept({
								method: 'DELETE',
								url: `api/b2b/admin/enums/sms-unit-prices/${smsPriceUnitId}`
							}).as('deleteSmsUnitPrice')

							cy.get('@detailRow').click()
							cy.wait('@getSmsUnitPrices').then((interceptionGetSmsPrices: any) => {
								// check status code of request
								expect(interceptionGetSmsPrices.response.statusCode).to.equal(200)
								cy.get(`[data-row-key="${smsPriceUnitId}"]`).click()
								cy.clickDeleteButtonWithConfCustom(FORM.SMS_UNIT_PRICES_FORM)
								cy.wait('@deleteSmsUnitPrice').then((interceptionCreate: any) => {
									// check status code of request
									expect(interceptionCreate.response.statusCode).to.equal(200)
									// check conf toast message
									cy.checkSuccessToastMessage()
								})
							})
						})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Filter SMS unit prices table', () => {
			cy.visit('/sms-credits')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/sms-unit-prices/actual'
				}).as('getSmsUnitPricesActual')
				cy.wait('@getSmsUnitPricesActual').then((interceptionGetSmsPricesActual: any) => {
					// check status code of request
					expect(interceptionGetSmsPricesActual.response.statusCode).to.equal(200)

					// sort table
					cy.sortTable('sortby-country')

					// search
					cy.setInputValue(FORM.SMS_UNIT_PRICES_FILTER, 'search', 'Bulharsko', true)
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})

	context('SMS stats', () => {
		it('Change SMS stats country and date', () => {
			cy.visit('/sms-credits')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/notino-dashboard/sms-time-stats'
				}).as('getSmsTimeStats')
				cy.wait('@getSmsTimeStats').then((interceptionGetSmsTimeStats: any) => {
					// check status code of request
					expect(interceptionGetSmsTimeStats.response.statusCode).to.equal(200)
					cy.selectOptionDropdownCustom(undefined, SMS_TIME_STATS_COUNTRY_PICKER_ID, undefined, true)
					cy.wait('@getSmsTimeStats').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
					const now = dayjs()
					let dateValue
					if (now.month() === 11) {
						dateValue = now.subtract(1, 'month').format('YYYY-MM')
					} else {
						dateValue = now.add(1, 'month').format('YYYY-MM')
					}
					cy.setDateInputValue(undefined, SMS_TIME_STATS_DATE_PICKER_ID, dateValue)
					cy.wait('@getSmsTimeStats').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})

	context('Recharge SMS credit for salons', () => {
		// NOTE: at least one PUBLISHED and PREMIUM salon with walletID must exists in the DB in order to test work correctly
		it('Create transaction', () => {
			cy.visit('/sms-credits')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
					cy.intercept({
						method: 'GET',
						pathname: '/api/b2b/admin/salons*'
					}).as('getSalons')
					cy.intercept({
						method: 'GET',
						pathname: '/api/b2b/admin/enums/sms-unit-prices/actual'
					}).as('getSmsUnitPricesActual')
					cy.intercept({
						method: 'POST',
						pathname: '/admin/wallets/transactions'
					}).as('createTransaction')
					cy.get(`#${RECHARGE_SMS_CREDIT_BUTTON_ID}`).click()
					cy.wait(['@getSalons', '@getSmsUnitPricesActual']).then(([interceptionGetSalons, interceptionGetSmsUnitPricesActual]: any[]) => {
						// check status code of request
						expect(interceptionGetSalons.response.statusCode).to.equal(200)
						expect(interceptionGetSmsUnitPricesActual.response.statusCode).to.equal(200)

						// change lng to SK to load correct test data
						cy.selectOptionDropdownCustom(FORM.RECHARGE_SMS_CREDIT_FILTER, 'countryCode', 'SK', true)
						cy.wait('@getSalons').then((interception: any) => {
							expect(interception.response.statusCode).to.equal(200)

							cy.get('.noti-table .ant-table-thead .ant-table-selection-column .ant-checkbox-input').click({ force: true })
							// wait for the animation
							cy.wait(1000)
							cy.get(`#${RECHARGE_SMS_CREDIT_CONTINUE_BUTTON_ID}`).click()
							cy.setInputValue(FORM.RECHARGE_SMS_CREDIT, 'amount', smsCredit.update.amount)
							cy.setInputValue(FORM.RECHARGE_SMS_CREDIT, 'transactionNote', smsCredit.update.transactionNote)
							cy.clickButton(SUBMIT_BUTTON_ID, FORM.SMS_UNIT_PRICES_FORM)
							cy.wait('@createTransaction').then((interceptionCreateTransaction: any) => {
								// check status code of login request
								expect(interceptionCreateTransaction.response.statusCode).to.equal(200)
								// check conf toast message
								cy.checkSuccessToastMessage()
								cy.location('pathname').should('eq', '/sms-credits/recharge')
							})
						})
					})
				} else {
					cy.get(`#${RECHARGE_SMS_CREDIT_BUTTON_ID}`).click()
					cy.checkForbiddenModal()
				}
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Filter salons table', () => {
			cy.visit('/sms-credits/recharge')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/salons*'
				}).as('getSalons')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/sms-unit-prices/actual'
				}).as('getSmsUnitPricesActual')
				cy.wait(['@getSalons', '@getSmsUnitPricesActual']).then(([interceptionGetSalons, interceptionGetSmsUnitPricesACtual]: any[]) => {
					// check status code of request
					expect(interceptionGetSalons.response.statusCode).to.equal(200)
					expect(interceptionGetSmsUnitPricesACtual.response.statusCode).to.equal(200)

					cy.selectOptionDropdownCustom(FORM.RECHARGE_SMS_CREDIT_FILTER, 'countryCode', 'SK', true)
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// change pagination
					cy.changePagination(100)
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// search salons
					cy.setInputValue(FORM.RECHARGE_SMS_CREDIT_FILTER, 'search', 'Salon', true)
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// filter table
					cy.clickButton(FILTER_BUTTON_ID, FORM.RECHARGE_SMS_CREDIT_FILTER)
					// wait for animation
					cy.wait(1000)
					cy.selectOptionDropdownCustom(FORM.RECHARGE_SMS_CREDIT_FILTER, 'sourceType', undefined, true)
					cy.setInputValue(FORM.RECHARGE_SMS_CREDIT_FILTER, 'walletAvailableBalanceTo', '100')
					cy.setInputValue(FORM.RECHARGE_SMS_CREDIT_FILTER, 'walletAvailableBalanceFrom', '1')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default smsCreditsAdminPageCRUDTestSuite
