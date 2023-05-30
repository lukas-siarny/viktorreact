import { loginViaApi } from '../../support/e2e'

import category from '../../fixtures/category.json'

// enums
import { ADD_BUTTON_ID, CATEGORY_PARAMS_SWITCH_TYPE_ID, DELETE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
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

	// CREATE parameter (localized)
	it('Create category parameters', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/category-parameters/'
		}).as('createCategoryParameters')
		cy.visit('/category-parameters/create')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
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
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	// CREATE NEW VALUE (localized)
	it('Create category parameter values', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/enums/category-parameters/'
		}).as('getCategoryParametersList')
		cy.intercept({
			method: 'POST',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/`
		}).as('createCategoryParameterValue')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
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
		} else if (actions.includes(CRUD_OPERATIONS.READ)) {
			cy.visit('/category-parameters')
			cy.wait('@getCategoryParametersList').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)

				// open first category param from table
				cy.get('main.ant-layout-content').then(($body) => {
					if ($body.find('.ant-table .ant-table-row:first').length) {
						cy.get('.ant-table .ant-table-row:first')
							.as('detailRow')
							.invoke('attr', 'data-row-key')
							.then((dataRowKey) => {
								const paramsID = dataRowKey || ''
								cy.intercept({
									method: 'GET',
									url: `/api/b2b/admin/enums/category-parameters/${paramsID}`
								}).as('getCategoryParametersForReadPermission')
								cy.get('@detailRow').click()
								cy.wait('@getCategoryParametersForReadPermission').then((intreceptionDetail: any) => {
									expect(intreceptionDetail.response.statusCode).to.equal(200)
									cy.clickButton(CATEGORY_PARAMS_SWITCH_TYPE_ID, FORM.CATEGORY_PARAMS, true)
									cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
									cy.checkForbiddenModal()
								})
							})
					}
				})
			})
		} else {
			cy.visit(`/category-parameters/${categoryParameterID}`)
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	// PATCH value (localized)
	it('Update category parameter value', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/enums/category-parameters/'
		}).as('getCategoryParametersList')
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/*`
		}).as('updateCategoryParameterValue')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
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
		} else if (actions.includes(CRUD_OPERATIONS.READ)) {
			cy.visit('/category-parameters')
			cy.wait('@getCategoryParametersList').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)

				// open first category param from table
				cy.get('main.ant-layout-content').then(($body) => {
					if ($body.find('.ant-table .ant-table-row:first').length) {
						cy.get('.ant-table .ant-table-row:first')
							.as('detailRow')
							.invoke('attr', 'data-row-key')
							.then((dataRowKey) => {
								const paramsID = dataRowKey || ''
								cy.intercept({
									method: 'GET',
									url: `/api/b2b/admin/enums/category-parameters/${paramsID}`
								}).as('getCategoryParametersForReadPermission')
								cy.get('@detailRow').click()
								cy.wait('@getCategoryParametersForReadPermission').then((intreceptionDetail: any) => {
									expect(intreceptionDetail.response.statusCode).to.equal(200)
									cy.clickButton(CATEGORY_PARAMS_SWITCH_TYPE_ID, FORM.CATEGORY_PARAMS, true)
									cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
									cy.checkForbiddenModal()
								})
							})
					}
				})
			})
		} else {
			cy.visit(`/category-parameters/${categoryParameterID}`)
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	// DELETE value (localized)
	it('delete category parameter value', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/enums/category-parameters/'
		}).as('getCategoryParametersList')
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}/values/*`
		}).as('deleteCategoryParameterValue')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
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
		} else if (actions.includes(CRUD_OPERATIONS.READ)) {
			cy.visit('/category-parameters')
			cy.wait('@getCategoryParametersList').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)

				// open first category param from table
				cy.get('main.ant-layout-content').then(($body) => {
					if ($body.find('.ant-table .ant-table-row:first').length) {
						cy.get('.ant-table .ant-table-row:first')
							.as('detailRow')
							.invoke('attr', 'data-row-key')
							.then((dataRowKey) => {
								const paramsID = dataRowKey || ''
								cy.intercept({
									method: 'GET',
									url: `/api/b2b/admin/enums/category-parameters/${paramsID}`
								}).as('getCategoryParametersForReadPermission')
								cy.get('@detailRow').click()
								cy.wait('@getCategoryParametersForReadPermission').then((intreceptionDetail: any) => {
									expect(intreceptionDetail.response.statusCode).to.equal(200)
									cy.get(`#${FORM.CATEGORY_PARAMS}-delete-btn`).click()
									cy.checkForbiddenModal()
								})
							})
					}
				})
			})
		} else {
			cy.visit(`/category-parameters/${categoryParameterID}`)
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	// UPDATE paramter title
	it('Update category parameters', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/enums/category-parameters/'
		}).as('getCategoryParametersList')
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('updateCategoryParameters')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
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
		} else if (actions.includes(CRUD_OPERATIONS.READ)) {
			cy.visit('/category-parameters')
			cy.wait('@getCategoryParametersList').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)

				// open first category param from table
				cy.get('main.ant-layout-content').then(($body) => {
					if ($body.find('.ant-table .ant-table-row:first').length) {
						cy.get('.ant-table .ant-table-row:first')
							.as('detailRow')
							.invoke('attr', 'data-row-key')
							.then((dataRowKey) => {
								const paramsID = dataRowKey || ''
								cy.intercept({
									method: 'GET',
									url: `/api/b2b/admin/enums/category-parameters/${paramsID}`
								}).as('getCategoryParametersForReadPermission')
								cy.get('@detailRow').click()
								cy.wait('@getCategoryParametersForReadPermission').then((intreceptionDetail: any) => {
									expect(intreceptionDetail.response.statusCode).to.equal(200)
									cy.clickButton(CATEGORY_PARAMS_SWITCH_TYPE_ID, FORM.CATEGORY_PARAMS, true)
									cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY_PARAMS)
									cy.checkForbiddenModal()
								})
							})
					}
				})
			})
		} else {
			cy.visit(`/category-parameters/${categoryParameterID}`)
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	// DELETE paramter
	it('Delete category parameters', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('getCategoryParameters')
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/enums/category-parameters/'
		}).as('getCategoryParametersList')
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/category-parameters/${categoryParameterID}`
		}).as('deleteCategoryParameters')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
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
		} else if (actions.includes(CRUD_OPERATIONS.READ)) {
			cy.visit('/category-parameters')
			cy.wait('@getCategoryParametersList').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)

				// open first category param from table
				cy.get('main.ant-layout-content').then(($body) => {
					if ($body.find('.ant-table .ant-table-row:first').length) {
						cy.get('.ant-table .ant-table-row:first')
							.as('detailRow')
							.invoke('attr', 'data-row-key')
							.then((dataRowKey) => {
								const paramsID = dataRowKey || ''
								cy.intercept({
									method: 'GET',
									url: `/api/b2b/admin/enums/category-parameters/${paramsID}`
								}).as('getCategoryParametersForReadPermission')
								cy.get('@detailRow').click()
								cy.wait('@getCategoryParametersForReadPermission').then((intreceptionDetail: any) => {
									expect(intreceptionDetail.response.statusCode).to.equal(200)
									cy.get(`#${FORM.CATEGORY_PARAMS}-delete-btn`).click()
									cy.checkForbiddenModal()
								})
							})
					}
				})
			})
		} else {
			cy.visit(`/category-parameters/${categoryParameterID}`)
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	// FILTER
	it('Filter category params', () => {
		cy.intercept({
			method: 'GET',
			url: '/api/b2b/admin/enums/category-parameters/'
		}).as('filterCategoryParams')
		cy.visit('/category-parameters')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.setInputValue(FORM.CATEGORY_PARAMS_FILTER, 'search', category.filter.search)
			cy.wait('@filterCategoryParams').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				cy.location('pathname').should('eq', '/category-parameters')
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
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
}

export default categoryParameterCRUDTestSuite
