import { loginViaApi } from '../../support/e2e'

import category from '../../fixtures/category.json'

// enums
import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const categoryParameterCRUDTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	let categoryParameterID: any

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

	// TODO: zmenila sa implementacia parametrov na BE, po update FE bude treba upravit aj testy

	/* it('Create category parameters', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/category-parameters/'
		}).as('createCategoryParameters')
		cy.visit('/category-parameters/create')
		cy.setInputValue(FORM.CATEGORY_PARAMS, 'nameLocalizations-0-value', category.parameter.create.title)
		cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-0-valueLocalizations-0-value', category.parameter.create.value)
		cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
		cy.wait('@createCategoryParameters').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			categoryParameterID = interception.response.body.categoryParameter.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Update category parameters', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('updateCategoryParameters')
		cy.visit(`/category-parameters/${categoryParameterID}`)
		cy.wait('@getCategoryParameters').then((interceptorGetCategoryParameters: any) => {
			// check status code
			expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

			cy.setInputValue(FORM.CATEGORY_PARAMS, 'nameLocalizations-0-value', category.parameter.update.title, false, true)
			cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-0-valueLocalizations-0-value', category.parameter.update.value, false, true)
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
			cy.wait('@updateCategoryParameters').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	it('Delete category parameters', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('deleteCategoryParameters')
		cy.visit(`/category-parameters/${categoryParameterID}`)
		cy.wait('@getCategoryParameters').then((interceptorGetCategoryParameters: any) => {
			// check status code
			expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

			cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY_PARAMS)
			cy.wait('@deleteCategoryParameters').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
				cy.location('pathname').should('eq', '/category-parameters')
			})
		})
	}) */
}

export default categoryParameterCRUDTestSuite
