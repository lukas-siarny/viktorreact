import { loginViaApi } from '../../support/e2e'

import specialistContact from '../../fixtures/specialist-contact.json'

// enums
import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const specialistContactsCRUDTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	let specialistContactID: any

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

	it('Create specialist contact', () => {
		cy.visit('/specialist-contacts')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/enums/contacts/'
			}).as('createSpecialistContact')
			cy.clickButton(CREATE_BUTTON_ID, FORM.SPECIALIST_CONTACT)
			cy.selectOptionDropdown(FORM.SPECIALIST_CONTACT, 'countryCode', specialistContact.create.countryCode)
			cy.selectOptionDropdownCustom(FORM.SPECIALIST_CONTACT, 'phonePrefixCountryCode', specialistContact.create.phonePrefixCountryCode, true)
			cy.setInputValue(FORM.SPECIALIST_CONTACT, 'phone', specialistContact.create.phone)
			cy.setInputValue(FORM.SPECIALIST_CONTACT, 'email', specialistContact.create.email)
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.SPECIALIST_CONTACT)
			cy.wait('@createSpecialistContact').then((interception: any) => {
				// check status code of request
				expect(interception.response.statusCode).to.equal(200)
				specialistContactID = interception.response.body.contact.id
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Update specialist contact', () => {
		cy.visit('/specialist-contacts')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/enums/contacts/${specialistContactID}`
			}).as('updateSpecialistContact')
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/enums/contacts/${specialistContactID}`
			}).as('getSpecialistContact')
			cy.get(`[data-row-key="${specialistContactID}"]`).click()
			cy.selectOptionDropdownCustom(FORM.SPECIALIST_CONTACT, 'countryCode', specialistContact.update.countryCode, true)
			cy.selectOptionDropdownCustom(FORM.SPECIALIST_CONTACT, 'phonePrefixCountryCode', specialistContact.update.phonePrefixCountryCode, true)
			cy.setInputValue(FORM.SPECIALIST_CONTACT, 'phone', specialistContact.update.phone, false, true)
			cy.setInputValue(FORM.SPECIALIST_CONTACT, 'email', specialistContact.update.email, false, true)
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.SPECIALIST_CONTACT)
			cy.wait('@updateSpecialistContact').then((interception: any) => {
				// check status code of request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	// NOTE: must go after create test, but before delete test
	it('Filter specialist contact', () => {
		cy.visit('/specialist-contacts')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/enums/contacts/'
			}).as('filterSpecialistContact')
			cy.wait('@filterSpecialistContact').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				cy.setInputValue(FORM.SPECIALIST_CONTACT_FILTER, 'search', specialistContact.filter.search)
				cy.location('pathname').should('eq', '/specialist-contacts')
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Delete specialist contact', () => {
		cy.visit('/specialist-contacts')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/enums/contacts/${specialistContactID}`
			}).as('deleteSpecialistContact')
			cy.get(`[data-row-key="${specialistContactID}"]`).click()
			cy.clickDeleteButtonWithConfCustom(FORM.SPECIALIST_CONTACT)
			cy.wait('@deleteSpecialistContact').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
				cy.location('pathname').should('eq', '/specialist-contacts')
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})
}

export default specialistContactsCRUDTestSuite
