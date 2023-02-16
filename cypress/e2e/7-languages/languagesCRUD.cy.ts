import { CREATE_BUTTON_ID, FORM } from '../../../src/utils/enums'

// fixtures
import specialistContact from '../../fixtures/specialist-contact.json'

describe('Languages', () => {
	let languageID: any
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	it('Create language', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/languages/'
		}).as('createLanguage')
		cy.visit('/languages-in-salons')
		cy.clickButton(FORM.LANGUAGES, CREATE_BUTTON_ID)
		// TODO: ako by sa spraviklo enum na field arraye?
		cy.setInputValue(FORM.LANGUAGES, 'nameLocalizations-0-value', 'test')
		// TODO: upload a ostatne optional fieldy nefunguje upoload
		// cy.uploadFile('image', '../images/test.jpg', FORM.LANGUAGES)

		cy.get(`#${FORM.LANGUAGES}-form`).submit()
		cy.wait('@createLanguage').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			languageID = interception.response.body.language.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Update language', () => {
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/enums/languages/${languageID}`
		}).as('updateLanguage')

		cy.visit('/languages-in-salons')
		cy.get(`[data-row-key="${languageID}"]`).click()
		cy.setInputValue(FORM.LANGUAGES, 'nameLocalizations-0-value', 'updated test', false, true)
		cy.get(`#${FORM.LANGUAGES}-form`).submit()
		cy.wait('@updateLanguage').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Delete specialist contact', () => {
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/languages/${languageID}`
		}).as('deleteLanguage')
		cy.visit('/languages-in-salons')
		cy.get(`[data-row-key="${languageID}"]`).click()
		cy.clickDeleteButtonWithConfCustom(FORM.LANGUAGES)
		cy.wait('@deleteLanguage').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
			cy.location('pathname').should('eq', '/languages-in-salons')
		})
	})
})
