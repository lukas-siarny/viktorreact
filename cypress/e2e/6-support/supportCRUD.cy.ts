import { CREATE_BUTTON_ID, FORM } from '../../../src/utils/enums'

// fixtures
import supportContact from '../../fixtures/support.json'
import languages from '../../fixtures/languages.json'

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
		cy.clickButton(FORM.SUPPORT_CONTACT, CREATE_BUTTON_ID)
		cy.selectOptionDropdownCustom(FORM.SUPPORT_CONTACT, 'countryCode', supportContact.create.countryCode, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'emails-0-email', supportContact.create.emails[0])
		cy.selectOptionDropdownCustom(FORM.SUPPORT_CONTACT, 'phones-0-phonePrefixCountryCode', supportContact.create.phones[0].phonePrefixCountryCode, true)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'phones-0-phone', supportContact.create.phones[0].phone)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'street', supportContact.create.address.street)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'city', supportContact.create.address.city)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'streetNumber', supportContact.create.address.streetNumber)
		cy.setInputValue(FORM.SUPPORT_CONTACT, 'zipCode', supportContact.create.address.zipCode)
		// TODO: text areu treba dorobit
		// cy.setInputValue(FORM.SUPPORT_CONTACT, 'note', supportContact.create.note)
		// TODO: co je toto?
		// cy.get('h3.form-title').as('formTitle').click()
		// cy.get('@formTitle').click()
		// cy.get('h3.form-title').as('formTitle').click()
		// cy.selectOptionDropdown(FORM.SUPPORT_CONTACT, 'phonePrefixCountryCode', specialistContact.create.phonePrefixCountryCode)
		// cy.get('@formTitle').click()
		// cy.setInputValue(FORM.SUPPORT_CONTACT, SUPPORT_FORM_FIELDS.STREET, specialistContact.create.street)
		// cy.setInputValue(FORM.SUPPORT_CONTACT, 'email', specialistContact.create.email)

		cy.get(`#${FORM.SUPPORT_CONTACT}-form`).submit()
		cy.wait('@createSupportContact').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			supportContactID = interception.response.body.supportContact.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})
})
