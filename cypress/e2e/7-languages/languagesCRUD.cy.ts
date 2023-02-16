import { CREATE_BUTTON_ID, FORM } from '../../../src/utils/enums'

// fixtures
import languages from '../../fixtures/languages.json'

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
	// CREATE
	it('Create language', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/languages/'
		}).as('createLanguage')

		cy.visit('/languages-in-salons')
		cy.clickButton(FORM.LANGUAGES, CREATE_BUTTON_ID)
		cy.setInputValue(FORM.LANGUAGES, 'nameLocalizations-0-value', languages.create.SK)
		cy.uploadFile('image', '../images/test.jpg', FORM.LANGUAGES)
		cy.wait(1000) // Cas ktory treba pockat kyms a nahra signed url obrazok
		cy.get(`#${FORM.LANGUAGES}-form`).submit()
		cy.wait('@createLanguage').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			languageID = interception.response.body.language.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})
	// UPDATE
	it('Update language', () => {
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/enums/languages/${languageID}`
		}).as('updateLanguage')

		cy.visit('/languages-in-salons')
		cy.get(`[data-row-key="${languageID}"]`).click()
		cy.setInputValue(FORM.LANGUAGES, 'nameLocalizations-0-value', languages.update.SK, false, true)
		cy.get(`#${FORM.LANGUAGES}-form`).submit()
		cy.wait('@updateLanguage').then((interception: any) => {
			// check status code of request
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})
	// DELETE
	it('Delete language', () => {
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
	// FILTER
	it('Filter language', () => {
		cy.intercept({
			method: 'GET',
			url: '/api/b2b/admin/enums/languages/'
		}).as('filterLanguage')
		cy.visit('/languages-in-salons')
		cy.setInputValue(FORM.LANGUAGES_FILTER, 'search', languages.filter.search)
		cy.wait('@filterLanguage').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			cy.location('pathname').should('eq', '/languages-in-salons')
		})
	})
})
