// utils
import { ADD_BUTTON_ID, DELETE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

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

	// CREATE parameter (localized)
	it('Create category parameters', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/category-parameters/'
		}).as('createCategoryParameters')
		cy.visit('/category-parameters/create')
		cy.setInputValue(FORM.CATEGORY_PARAMS, 'nameLocalizations-0-value', category.parameter.create.title)
		cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-0-valueLocalizations-0-value', category.value.create['value-1'])
		cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
		cy.wait('@createCategoryParameters').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			categoryParameterID = interception.response.body.categoryParameter.id
			// check conf toast message
			cy.checkSuccessToastMessage()
			// post nad params values po tom ako sa vytvori category param a existuje jeho id
			it('Create category parameter value', () => {
				cy.intercept({
					method: 'POST',
					url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/`
				}).as('createCategoryParameterValues')
				cy.wait('@createCategoryParameterValues').then((valuesInterception: any) => {
					expect(valuesInterception.response.statusCode).to.equal(200)
				})
			})
		})
	})

	// CREATE NEW VALUE (localized)
	it('Create category parameter values', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'POST',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/`
		}).as('createCategoryParameterValue')
		cy.visit(`/category-parameters/${categoryParameterID}`)
		cy.wait('@getCategoryParameters').then((interceptorGetCategoryParameters: any) => {
			// check status code
			expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)
			cy.clickButton(ADD_BUTTON_ID, FORM.CATEGORY_PARAMS)
			cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-1-valueLocalizations-0-value', category.value.create['value-2'], false, true)
			cy.clickButton(ADD_BUTTON_ID, FORM.CATEGORY_PARAMS)
			cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-2-valueLocalizations-0-value', category.value.create['value-3'], false, true)
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
			cy.wait('@createCategoryParameterValue').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	// PATCH value (localized)
	it('Update category parameter value', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/*`
		}).as('updateCategoryParameterValue')
		cy.visit(`/category-parameters/${categoryParameterID}`)
		cy.wait('@getCategoryParameters').then((interceptorGetCategoryParameters: any) => {
			// check status code
			expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)
			cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-0-valueLocalizations-0-value', category.value.update['value-1'], false, true)
			cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-1-valueLocalizations-0-value', category.value.update['value-2'], false, true)
			cy.setInputValue(FORM.CATEGORY_PARAMS, 'localizedValues-2-valueLocalizations-0-value', category.value.update['value-3'], false, true)
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
			cy.wait('@updateCategoryParameterValue').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	// DELETE value (localized)
	it('delete category parameter value', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/*`
		}).as('deleteCategoryParameterValue')
		cy.visit(`/category-parameters/${categoryParameterID}`)
		cy.wait('@getCategoryParameters').then((interceptorGetCategoryParameters: any) => {
			// check status code
			expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)
			cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY_PARAMS, `${DELETE_BUTTON_ID}-${0}`)
			cy.wait('@deleteCategoryParameterValue').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	// UPDATE paramter title
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
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
			cy.wait('@updateCategoryParameters').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	// DELETE paramter
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
	})

	// FILTER
	it('Filter category params', () => {
		cy.intercept({
			method: 'GET',
			url: '/api/b2b/admin/enums/category-parameters/'
		}).as('filterCategoryParams')
		cy.visit('/category-parameters')
		cy.setInputValue(FORM.CATEGORY_PARAMS_FILTER, 'search', category.filter.search)
		cy.wait('@filterCategoryParams').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			cy.location('pathname').should('eq', '/category-parameters')
		})
	})
	// TODO: dorobit testy pre minutove zobrazenie
	// CREATE parameter (minutes)
	// it('Create category parameters (minutes)', () => {
	// 	cy.intercept({
	// 		method: 'POST',
	// 		url: '/api/b2b/admin/enums/category-parameters/'
	// 	}).as('createCategoryParameters')
	// 	cy.visit('/category-parameters/create')
	// 	cy.clickButton('valueType', FORM.CATEGORY_PARAMS, true)
	// 	cy.setInputValue(FORM.CATEGORY_PARAMS, 'nameLocalizations-0-value', category.parameter.create.title)
	// 	cy.setInputValue(FORM.CATEGORY_PARAMS, 'values-0-value', category['value-minutes'].create['value-1'])
	// 	cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
	// 	cy.wait('@createCategoryParameters').then((interception: any) => {
	// 		// check status code of login request
	// 		expect(interception.response.statusCode).to.equal(200)
	// 		categoryParameterID = interception.response.body.categoryParameter.id
	// 		// check conf toast message
	// 		cy.checkSuccessToastMessage()
	// 		// post nad params values po tom ako sa vytvori category param a existuje jeho id
	// 		it('Create category parameter value', () => {
	// 			cy.intercept({
	// 				method: 'POST',
	// 				url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/`
	// 			}).as('createCategoryParameterValues')
	// 			cy.wait('@createCategoryParameterValues').then((valuesInterception: any) => {
	// 				expect(valuesInterception.response.statusCode).to.equal(200)
	// 			})
	// 		})
	// 	})
	// })

	// CREATE NEW VALUE (minutes)
	// it('Create category parameter values (minutes)', () => {
	// 	cy.intercept({
	// 		method: 'GET',
	// 		url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
	// 	}).as('getCategoryParameters')
	// 	cy.intercept({
	// 		method: 'POST',
	// 		url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/`
	// 	}).as('createCategoryParameterValue')
	// 	cy.visit(`/category-parameters/${categoryParameterID}`)
	// 	cy.wait('@getCategoryParameters').then((interceptorGetCategoryParameters: any) => {
	// 		// check status code
	// 		expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)
	// 		cy.clickButton(ADD_BUTTON_ID, FORM.CATEGORY_PARAMS)
	// 		cy.setInputValue(FORM.CATEGORY_PARAMS, 'values-1-value', category['value-minutes'].update['value-2'], false, true)
	// 		cy.clickButton(ADD_BUTTON_ID, FORM.CATEGORY_PARAMS)
	// 		cy.setInputValue(FORM.CATEGORY_PARAMS, 'values-2-value', category['value-minutes'].update['value-3'], false, true)
	// 		cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
	// 		cy.wait('@createCategoryParameterValue').then((interception: any) => {
	// 			// check status code of login request
	// 			expect(interception.response.statusCode).to.equal(200)
	// 			// check conf toast message
	// 			cy.checkSuccessToastMessage()
	// 		})
	// 	})
	// })
})
