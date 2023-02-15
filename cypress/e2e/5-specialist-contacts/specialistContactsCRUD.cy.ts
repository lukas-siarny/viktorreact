import { CREATE_BUTTON_ID, FORM } from '../../../src/utils/enums'

// fixtures
import specialistContact from '../../fixtures/specialist-contact.json'

describe('Specialit contacts', () => {
	let specialistContactID: any
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	it('Create specialist contact', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/contacts/'
		}).as('createSpecialistContact')
		cy.visit('/specialist-contacts')
		cy.clickButton(FORM.SPECIALIST_CONTACT, CREATE_BUTTON_ID)
		cy.selectOptionDropdown(FORM.SPECIALIST_CONTACT, 'countryCode', specialistContact.create.countryCode)
		cy.get('h3.form-title').as('formTitle').click()
		// cy.selectOptionDropdown(FORM.SPECIALIST_CONTACT, 'phonePrefixCountryCode', specialistContact.create.phonePrefixCountryCode)
		// cy.get('@formTitle').click()
		cy.setInputValue(FORM.SPECIALIST_CONTACT, 'phone', specialistContact.create.phone)
		cy.setInputValue(FORM.SPECIALIST_CONTACT, 'email', specialistContact.create.email)
		cy.get(`#${FORM.SPECIALIST_CONTACT}-form`).submit()
		cy.wait('@createSpecialistContact').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			specialistContactID = interception.response.body.contact.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Update specialist contact', () => {
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/enums/contacts/${specialistContactID}`
		}).as('updateSpecialistContact')
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/contacts/${specialistContactID}`
		}).as('getSpecialistContact')
		cy.visit('/specialist-contacts')
		cy.get(`[data-row-key="${specialistContactID}"]`).click()
		// cy.clearDropdownSelection('countryCode')
		// cy.selectOptionDropdown(FORM.SPECIALIST_CONTACT, 'countryCode', specialistContact.update.countryCode)
		cy.get('h3.form-title').as('formTitle').click()
		// cy.selectOptionDropdown(FORM.SPECIALIST_CONTACT, 'phonePrefixCountryCode', specialistContact.update.phonePrefixCountryCode)
		// cy.get('@formTitle').click()
		cy.setInputValue(FORM.SPECIALIST_CONTACT, 'phone', specialistContact.update.phone, false, true)
		cy.setInputValue(FORM.SPECIALIST_CONTACT, 'email', specialistContact.update.email, false, true)
		cy.get(`#${FORM.SPECIALIST_CONTACT}-form`).submit()
		cy.wait('@updateSpecialistContact').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Delete specialist contact', () => {
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/cosmetics/${specialistContactID}`
		}).as('deleteSpecialistContact')
		cy.visit('/specialist-contacts')
		cy.get(`[data-row-key="${specialistContactID}"]`).click()
		cy.clickDeleteButtonWithConfCustom(FORM.SPECIALIST_CONTACT)
		cy.wait('@deleteSpecialistContact').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
			cy.location('pathname').should('eq', '/specialist-contacts')
		})
	})
})
