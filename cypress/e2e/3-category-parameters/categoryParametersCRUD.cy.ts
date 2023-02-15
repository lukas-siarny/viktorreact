// utils
import { FORM } from '../../../src/utils/enums'

// fixtures
import category from '../../fixtures/category.json'

describe('Category parameters', () => {
	let categoryParameterID: any
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	it('Create category parameters', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/category-parameters/'
		}).as('createCategoryParameters')
		cy.visit('/category-parameters/create')
		cy.setInputValue(FORM.CATEGORY_PARAMS, 'nameLocalizations-0-value', category.parameter.create.title)
		cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-0-valueLocalizations-0-value', category.parameter.create.value)
		cy.get('form').submit()
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
			method: 'PATCH',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('updateCategoryParameters')
		cy.visit(`/category-parameters/${categoryParameterID}`)
		cy.setInputValue(FORM.CATEGORY_PARAMS, 'nameLocalizations-0-value', category.parameter.update.title, false, true)
		cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-0-valueLocalizations-0-value', category.parameter.update.value, false, true)
		cy.get('form').submit()
		cy.wait('@updateCategoryParameters').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Delete category parameters', () => {
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('deleteCategoryParameters')
		cy.visit(`/category-parameters/${categoryParameterID}`)
		cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY_PARAMS)
		cy.wait('@deleteCategoryParameters').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
			cy.location('pathname').should('eq', '/category-parameters')
		})
	})
})
