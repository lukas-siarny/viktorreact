import dayjs from 'dayjs'
import { loginViaApi } from '../../support/e2e'

import smsUnitPrices from '../../fixtures/smsUnitPrices.json'

// enums
import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const smsUnitPricesCRUDTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
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
				// NOTE: at least one SMS unit price should exists in DB
				cy.get('.ant-table-row:first').click()
				cy.clickButton(FORM.SMS_UNIT_PRICES_FORM, CREATE_BUTTON_ID)
				cy.setInputValue(FORM.SMS_UNIT_PRICES_FORM, 'amount', smsUnitPrices.create.amount)
				// NOTE: SMS unit price cannot exist in DB for specified date
				const dateValue = dayjs().add(1, 'month').format('YYYY-MM')
				cy.setDateInputValue(FORM.SMS_UNIT_PRICES_FORM, 'validFrom', dateValue)
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
				// NOTE: at least one SMS unit price should exists in DB
				cy.get('.ant-table-row:first')
					.as('detailRow')
					.invoke('attr', 'data-row-key')
					.then((dataRowKey) => {
						const [, countryCode] = (dataRowKey || '').split('_')

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
							const dateValueUpdate = dayjs().add(2, 'month').format('YYYY-MM')
							cy.setDateInputValue(FORM.SMS_UNIT_PRICES_FORM, 'validFrom', dateValueUpdate)
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
				// NOTE: at least one SMS unit price should exists in DB
				cy.get('.ant-table-row:first')
					.as('detailRow')
					.invoke('attr', 'data-row-key')
					.then((dataRowKey) => {
						const [, countryCode] = (dataRowKey || '').split('_')

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
}

export default smsUnitPricesCRUDTestSuite
