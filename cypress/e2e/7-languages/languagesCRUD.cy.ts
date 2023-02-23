import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID, CYPRESS } from '../../../src/utils/enums'

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
		cy.setInputValue(FORM.LANGUAGES, 'nameLocalizations-0-value', languages.create.name)
		cy.uploadFile('image', '../images/test.jpg', FORM.LANGUAGES)
		cy.wait(CYPRESS.S3_UPLOAD_WAIT_TIME) // Cas ktory treba pockat kym sa nahra signed url obrazok
		cy.clickButton(SUBMIT_BUTTON_ID, FORM.LANGUAGES)
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
		cy.intercept({
			method: 'GET',
			url: '/api/b2b/admin/enums/languages/'
		}).as('getLanguages')
		cy.visit('/languages-in-salons')
		cy.wait('@getLanguages')
		cy.get(`[data-row-key="${languageID}"]`).click()
		cy.wait(CYPRESS.ANIMATION_WAIT_TIME) // detail jazyka sa riesi len na strane FE tak 1sekunda je pre istotu kvoli animaciam kym sa vyrenderuju inputy
		cy.setInputValue(FORM.LANGUAGES, 'nameLocalizations-0-value', languages.update.name, false, true)
		cy.clickButton(SUBMIT_BUTTON_ID, FORM.LANGUAGES)
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
		cy.intercept({
			method: 'GET',
			url: '/api/b2b/admin/enums/languages/'
		}).as('getLanguages')
		cy.visit('/languages-in-salons')
		cy.wait('@getLanguages')
		cy.get(`[data-row-key="${languageID}"]`).click()
		cy.wait(CYPRESS.ANIMATION_WAIT_TIME) // detail jazyka sa riesi len na strane FE tak 1sekunda je pre istotu kvoli animaciam kym sa vyrenderuju inputy
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
