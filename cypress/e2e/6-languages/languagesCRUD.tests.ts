import { loginViaApi } from '../../support/e2e'

import languages from '../../fixtures/languages.json'

// enums
import { CREATE_BUTTON_ID, CYPRESS, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const languagesCRUDTestSuit = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	let languageID: any

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

	it('Create language', () => {
		cy.visit('/languages-in-salons')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/enums/languages/'
			}).as('createLanguage')
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
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Update language', () => {
		cy.visit('/languages-in-salons')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/enums/languages/${languageID}`
			}).as('updateLanguage')
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/enums/languages/'
			}).as('getLanguages')
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
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Delete language', () => {
		cy.visit('/languages-in-salons')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/enums/languages/${languageID}`
			}).as('deleteLanguage')
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/enums/languages/'
			}).as('getLanguages')
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
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Filter language', () => {
		cy.visit('/languages-in-salons')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/enums/languages/'
			}).as('filterLanguage')
			cy.setInputValue(FORM.LANGUAGES_FILTER, 'search', languages.filter.search)
			cy.wait('@filterLanguage').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				cy.location('pathname').should('eq', '/languages-in-salons')
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})
}

export default languagesCRUDTestSuit
