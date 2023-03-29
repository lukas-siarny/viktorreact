import { CRUD_OPERATIONS, CUSTOMER_ID, SALON_ID } from '../../enums'
import { CREATE_CUSTOMER_BUTTON_ID, DELETE_BUTTON_ID, FORM, PAGE, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

import { generateRandomInt, generateRandomString } from '../../support/helpers'

import customer from '../../fixtures/customer.json'

const getCustomer = () => {
	it('Open customer detail', () => {
		// get salonID from env
		const salonID = Cypress.env(SALON_ID)
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/${salonID}/customers`
		}).as('getCustomers')
		cy.visit('/')
		cy.get(`#${PAGE.CUSTOMERS}`).click()
		cy.wait('@getCustomers')
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/${salonID}/customers/*`
		}).as('getCustomer')
		cy.get('[index="0"] > .ant-table-column-sort').click()
		cy.wait('@getCustomer').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			const customerID = interception.response.body.salon.id
			Cypress.env(CUSTOMER_ID, customerID)
			cy.location('pathname').should('eq', `/salons/${salonID}/customers/${customerID}`)
			cy.log(`CUSTOMER_ID: ${customerID}`)
		})
	})
}

const customerTestSuite = (actions: CRUD_OPERATIONS[]): void => {
	context('Customer', () => {
		it('Create customer', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/customers'
			}).as('createCustomer')
			cy.visit(`/salons/${salonID}/customers/create`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
				cy.selectOptionDropdown(FORM.CUSTOMER, 'countryCode')
				cy.setInputValue(FORM.CUSTOMER, 'firstName', generateRandomString(6))
				cy.setInputValue(FORM.CUSTOMER, 'lastName', generateRandomString(6))
				cy.selectOptionDropdown(FORM.CUSTOMER, 'gender')
				cy.setInputValue(FORM.CUSTOMER, 'email', `${generateRandomString(6)}_${customer.create.emailSuffix}`)
				cy.setInputValue(FORM.CUSTOMER, 'phone', customer.create.phone)
				cy.uploadFile('gallery', '../images/test.jpg', FORM.CUSTOMER)
				cy.setInputValue(FORM.CUSTOMER, 'street', customer.create.street)
				cy.setInputValue(FORM.CUSTOMER, 'streetNumber', customer.create.streetNumber)
				cy.setInputValue(FORM.CUSTOMER, 'city', generateRandomString(7))
				cy.setInputValue(FORM.CUSTOMER, 'zipCode', generateRandomInt(5).toString())
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.CUSTOMER)
				cy.wait('@createCustomer').then((interception: any) => {
					// check status code of login request
					expect(interception.response.statusCode).to.equal(200)
					Cypress.env(CUSTOMER_ID, interception.response.body.customer.id)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')

				// check for forbidden modal in customers page
				cy.visit(`/salons/${salonID}/customers`)
				cy.clickButton(CREATE_CUSTOMER_BUTTON_ID)
				cy.checkForbiddenModal()
				getCustomer()
			}
		})

		it('Update customer', () => {
			// get salonID, customerID from env
			const salonID = Cypress.env(SALON_ID)
			const customerID = Cypress.env(CUSTOMER_ID)
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/customers/${customerID}`
			}).as('getCustomer')
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/customers/${customerID}`
			}).as('updateCustomer')
			cy.visit(`/salons/${salonID}/customers/${customerID}`)
			cy.wait('@getCustomer').then((interceptorGetCustomer: any) => {
				// check status code of login request
				expect(interceptorGetCustomer.response.statusCode).to.equal(200)
				// change input firstName for both cases
				cy.setInputValue(FORM.CUSTOMER, 'firstName', generateRandomString(7), true, true)
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
					cy.setInputValue(FORM.CUSTOMER, 'lastName', generateRandomString(10), true, true)
					cy.clearDropdownSelection('gender')
					cy.setInputValue(FORM.CUSTOMER, 'email', `${generateRandomString(6)}_${customer.update.emailSuffix}`, true, true)
					cy.setInputValue(FORM.CUSTOMER, 'phone', customer.update.phone, true, true)
					cy.setInputValue(FORM.CUSTOMER, 'street', customer.update.street, true, true)
					cy.setInputValue(FORM.CUSTOMER, 'streetNumber', customer.update.streetNumber, true, true)
					cy.setInputValue(FORM.CUSTOMER, 'city', generateRandomString(7), true, true)
					cy.setInputValue(FORM.CUSTOMER, 'zipCode', generateRandomInt(5).toString(), true, true)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.CUSTOMER)
					cy.wait('@updateCustomer').then((interception: any) => {
						// check status code of login request
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				} else {
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.CUSTOMER)
					cy.checkForbiddenModal()
				}
			})
		})
	})
}

export const deleteCustomer = (actions: CRUD_OPERATIONS[]) => {
	it('Delete customer', () => {
		// get salonID, customerID from env
		const salonID = Cypress.env(SALON_ID)
		const customerID = Cypress.env(CUSTOMER_ID)
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/customers/${customerID}`
		}).as('getCustomer')
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/customers/${customerID}`
		}).as('deleteCustomer')
		cy.visit(`/salons/${salonID}/customers/${customerID}`)
		cy.wait('@getCustomer').then((interceptorGetCustomer: any) => {
			// check status code of login request
			expect(interceptorGetCustomer.response.statusCode).to.equal(200)

			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
				cy.clickDeleteButtonWithConfCustom(FORM.CUSTOMER)
				cy.wait('@deleteCustomer').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
					cy.location('pathname').should('eq', `/salons/${salonID}/customers`)
				})
			} else {
				cy.clickButton(DELETE_BUTTON_ID, FORM.CUSTOMER)
				cy.checkForbiddenModal()
			}
		})
	})
}

export default customerTestSuite
