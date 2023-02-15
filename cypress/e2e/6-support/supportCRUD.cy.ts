import { CREATE_BUTTON_ID, FORM } from '../../../src/utils/enums'

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
	it('Create support contacts', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/support-contacts/'
		}).as('createSupportContact')
		cy.visit('/support-contacts')
		cy.clickButton(CREATE_BUTTON_ID, FORM.SUPPORT_CONTACT)
		cy.selectOptionDropdown(FORM.SUPPORT_CONTACT, 'streetNumber', supportContact.create.address.streetNumber)
		// cy.get('h3.form-title').as('formTitle').click()
		// cy.selectOptionDropdown(FORM.SUPPORT_CONTACT, 'phonePrefixCountryCode', specialistContact.create.phonePrefixCountryCode)
		// cy.get('@formTitle').click()
		// cy.setInputValue(FORM.SUPPORT_CONTACT, SUPPORT_FORM_FIELDS.STREET, specialistContact.create.street)
		// cy.setInputValue(FORM.SUPPORT_CONTACT, 'email', specialistContact.create.email)
		cy.get(`#${FORM.SUPPORT_CONTACT}-form`).submit()
		cy.wait('@createSpecialistContact').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			supportContactID = interception.response.body.supportContact.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})
	//
	// it('Update specialist contact', () => {
	// 	cy.intercept({
	// 		method: 'PATCH',
	// 		url: `/api/b2b/admin/enums/contacts/${specialistContactID}`
	// 	}).as('updateSpecialistContact')
	// 	cy.visit('/specialist-contacts')
	// 	cy.clickButton(FORM.SPECIALIST_CONTACT, CREATE_BUTTON_ID)
	// 	cy.selectOptionDropdown(FORM.SPECIALIST_CONTACT, 'countryCode', specialistContact.update.countryCode)
	// 	cy.get('h3.form-title').as('formTitle').click()
	// 	// cy.selectOptionDropdown(FORM.SPECIALIST_CONTACT, 'phonePrefixCountryCode', specialistContact.update.phonePrefixCountryCode)
	// 	// cy.get('@formTitle').click()
	// 	cy.setInputValue(FORM.SPECIALIST_CONTACT, 'phone', specialistContact.update.phone)
	// 	cy.setInputValue(FORM.SPECIALIST_CONTACT, 'email', specialistContact.update.email)
	// 	cy.get(`#${FORM.SPECIALIST_CONTACT}-form`).submit()
	// 	cy.wait('@updateSpecialistContact').then((interception: any) => {
	// 		// check status code of request
	// 		expect(interception.response.statusCode).to.equal(200)
	// 		// check conf toast message
	// 		cy.checkSuccessToastMessage()
	// 	})
	// })
	//
	// it('Delete specialist contact', () => {
	// 	cy.intercept({
	// 		method: 'DELETE',
	// 		url: `/api/b2b/admin/enums/cosmetics/${specialistContactID}`
	// 	}).as('deleteSpecialistContact')
	// 	cy.visit('/specialist-contacts')
	// 	cy.get(`[data-row-key="${specialistContactID}"]`).click()
	// 	cy.clickDeleteButtonWithConf(FORM.SPECIALIST_CONTACT)
	// 	cy.wait('@deleteSpecialistContact').then((interception: any) => {
	// 		// check status code
	// 		expect(interception.response.statusCode).to.equal(200)
	// 		// check conf toast message
	// 		cy.checkSuccessToastMessage()
	// 		cy.location('pathname').should('eq', '/specialist-contacts')
	// 	})
	// })
})
