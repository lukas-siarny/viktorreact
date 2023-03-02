import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

// fixtures
import supportContact from '../../fixtures/support.json'

describe('Support contacts', () => {
	let supportContactID: any
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})
	// CREATE
	it('Create support contact', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/support-contacts/'
		}).as('createSupportContact')
		cy.visit('/support-contacts')
		cy.clickButton(FORM.SUPPORT_CONTACT, CREATE_BUTTON_ID)
		cy.selectOptionDropdownCustom(FORM.SUPPORT_CONTACT, 'countryCode', supportContact.create.countryCode, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'emails-0-email', supportContact.create.emails[0])
		cy.selectOptionDropdownCustom(FORM.SUPPORT_CONTACT, 'phones-0-phonePrefixCountryCode', supportContact.create.phones[0].phonePrefixCountryCode, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'phones-0-phone', supportContact.create.phones[0].phone)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'street', supportContact.create.address.street)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'city', supportContact.create.address.city)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'streetNumber', supportContact.create.address.streetNumber)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'zipCode', supportContact.create.address.zipCode)
		cy.clickButton(SUBMIT_BUTTON_ID, FORM.SUPPORT_CONTACT)
		cy.wait('@createSupportContact').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			supportContactID = interception.response.body.supportContact.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})
	// UPDATE
	it('Update support contact', () => {
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/enums/support-contacts/${supportContactID}`
		}).as('updateSupportContact')
		cy.intercept({
			method: 'GET',
			url: '/api/b2b/admin/enums/support-contacts/'
		}).as('getSupportContacts')
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/support-contacts/${supportContactID}`
		}).as('getSupportContact')
		cy.visit('/support-contacts')
		cy.wait('@getSupportContacts')
		cy.get(`[data-row-key="${supportContactID}"]`).click()
		cy.wait('@getSupportContact')
		cy.selectOptionDropdownCustom(FORM.SUPPORT_CONTACT, 'countryCode', supportContact.update.countryCode, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'emails-0-email', supportContact.update.emails[0], false, true)
		cy.selectOptionDropdownCustom(FORM.SUPPORT_CONTACT, 'phones-0-phonePrefixCountryCode', supportContact.update.phones[0].phonePrefixCountryCode, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'phones-0-phone', supportContact.update.phones[0].phone, false, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'street', supportContact.update.address.street, false, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'city', supportContact.update.address.city, false, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'streetNumber', supportContact.update.address.streetNumber, false, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'zipCode', supportContact.update.address.zipCode, false, true)
		cy.clickButton(SUBMIT_BUTTON_ID, FORM.SUPPORT_CONTACT)
		cy.wait('@updateSupportContact').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})
	// DELETE
	it('Delete support contact', () => {
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/support-contacts/${supportContactID}`
		}).as('deleteSupportContact')
		cy.intercept({
			method: 'GET',
			url: '/api/b2b/admin/enums/support-contacts/'
		}).as('getSupportContacts')
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/support-contacts/${supportContactID}`
		}).as('getSupportContact')
		cy.visit('/support-contacts')
		cy.wait('@getSupportContacts')
		cy.get(`[data-row-key="${supportContactID}"]`).click()
		cy.wait('@getSupportContact')
		cy.clickDeleteButtonWithConfCustom(FORM.SUPPORT_CONTACT)
		cy.wait('@deleteSupportContact').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
			cy.location('pathname').should('eq', '/support-contacts')
		})
	})
	// FILTER
	it('Filter support contact', () => {
		cy.intercept({
			method: 'GET',
			url: '/api/b2b/admin/enums/support-contacts/'
		}).as('filterSupportContact')
		cy.visit('/support-contacts')
		cy.setInputValue(FORM.SUPPORT_CONTACTS_FILTER, 'search', supportContact.filter.search)
		cy.wait('@filterSupportContact').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			cy.location('pathname').should('eq', '/support-contacts')
		})
	})
})