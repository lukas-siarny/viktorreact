import { generateRandomString, generateRandomInt } from '../../support/helpers'
import { FORM } from '../../../src/utils/enums'

import customer from '../../fixtures/customer.json'

describe(`Salon's customer`, () => {
	context('CRUD operations', () => {
		// id of customer
		let customerID = 0
		beforeEach(() => {
			// restore local storage with tokens from snapshot
			cy.restoreLocalStorage()
		})

		afterEach(() => {
			// take snapshot of local storage with new refresh and access token
			cy.saveLocalStorage()
		})

		it('Create customer', () => {
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/customers'
			}).as('createCustomer')
			cy.visit('/customers/create')
			cy.selectOptionDropdown(FORM.CUSTOMER, 'countryCode')
			cy.setInputValue(FORM.CUSTOMER, 'firstName', generateRandomString(6))
			cy.setInputValue(FORM.CUSTOMER, 'lastName', generateRandomString(6))
			cy.selectOptionDropdown(FORM.CUSTOMER, 'gender')
			cy.setInputValue(FORM.CUSTOMER, 'email', customer.create.email)
			cy.setInputValue(FORM.CUSTOMER, 'phone', customer.create.phone)
			cy.setInputValue(FORM.CUSTOMER, 'street', customer.create.street)
			cy.setInputValue(FORM.CUSTOMER, 'city', generateRandomString(7))
			cy.setInputValue(FORM.CUSTOMER, 'zipCode', generateRandomInt(5).toString())
			cy.setSearchBoxValueAndSelectFirstOption('salonID', '3', '.rc-virtual-list', FORM.CUSTOMER)
			cy.get('form').submit()
			cy.wait('@createCustomer').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				customerID = interception.response.body.customer.id
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})

		it('Update customer', () => {
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/customers/${customerID}`
			}).as('updateCustomer')
			cy.visit(`/customers/${customerID}`)
			const firstName = generateRandomString(7)
			cy.setInputValue(FORM.CUSTOMER, 'firstName', firstName, true)
			cy.setInputValue(FORM.CUSTOMER, 'lastName', generateRandomString(10), true)
			cy.clearDropdownSelection('gender')
			cy.setInputValue(FORM.CUSTOMER, 'email', customer.update.email, true)
			cy.setInputValue(FORM.CUSTOMER, 'phone', customer.update.phone, true)
			cy.setInputValue(FORM.CUSTOMER, 'street', customer.update.street, true)
			cy.setInputValue(FORM.CUSTOMER, 'city', generateRandomString(7), true)
			cy.setInputValue(FORM.CUSTOMER, 'zipCode', generateRandomInt(5).toString(), true)

			cy.get('form').submit()
			cy.wait('@updateCustomer').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})

		it('Delete customer', () => {
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/customers/${customerID}`
			}).as('deleteCustomer')
			cy.visit(`/customers/${customerID}`)
			cy.clickDeleteButtonWithConf(FORM.CUSTOMER)
			cy.wait('@deleteCustomer').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
				cy.location('pathname').should('eq', `/customers`)
			})
		})
	})
})
