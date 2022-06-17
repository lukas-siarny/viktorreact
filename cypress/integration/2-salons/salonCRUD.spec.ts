// utils
import { FORM } from '../../../src/utils/enums'

import salon from '../../fixtures/salon.json'

context('Salon', () => {
	// id of created salon
	// const createdSalonID = 0
	beforeEach(() => {
		// restore local storage with tokens from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	/* it('Create salon', () => {
		// prepare image for upload
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/salons'
		}).as('createSalon')
		cy.visit('/salons/create')
		cy.setInputValue(FORM.SALON, 'name', salon.create.name)
		cy.uploadFile('gallery', '../images/test.jpg', FORM.SALON)
		cy.setInputValue(FORM.SALON, 'phone', salon.create.phone)
		cy.setInputValue(FORM.SALON, 'email', salon.create.email)
		cy.setSearchBoxValueAndSelectFirstOption('address-search', salon.create.address, '.pac-item', undefined, true)
		cy.setInputValue(FORM.SALON, 'otherPaymentMethods', salon.create.paymentMethods)
		cy.setSearchBoxValueAndSelectFirstOption('userID', 't', '.rc-virtual-list', FORM.SALON)
		cy.clickButton('payByCard', FORM.SALON, true)
		cy.get('form').submit()
		cy.wait('@createSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			createdSalonID = interception.response.body.salon.id
			cy.location('pathname').should('eq', `/salons/${createdSalonID}`)
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Update created salon', () => {
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/salons/${createdSalonID}`
		}).as('updateSalon')
		cy.visit(`/salons/${createdSalonID}`)
		cy.setInputValue(FORM.SALON, 'name', salon.update.name, true)
		cy.get('form').submit()
		cy.wait('@updateSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Delete created salon', () => {
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/salons/${createdSalonID}`
		}).as('deleteSalon')
		cy.visit(`/salons/${createdSalonID}`)
		cy.clickDeleteButtonWithConf(FORM.SALON)
		cy.wait('@deleteSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
			cy.location('pathname').should('eq', `/salons`)
		})
	}) */
})
