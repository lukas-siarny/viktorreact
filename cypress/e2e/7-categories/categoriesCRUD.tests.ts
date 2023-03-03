import { loginViaApi } from '../../support/e2e'

import category from '../../fixtures/category.json'

// enums
import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const categoriesCRUDTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	let industryID: any
	let categoryID: any
	let serviceID: any

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

	context('Create', () => {
		it('Create industry', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/enums/categories/'
				}).as('createCategory')
				cy.clickButton(FORM.CATEGORY, CREATE_BUTTON_ID)
				cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.industry.create.title)
				cy.uploadFile('image', '../images/test.jpg', FORM.CATEGORY)
				cy.uploadFile('icon', '../images/test.jpg', FORM.CATEGORY)
				// wait for file to be uploaded
				cy.wait(2000)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
				cy.wait('@createCategory').then((interception: any) => {
					// check status code of request
					expect(interception.response.statusCode).to.equal(200)
					industryID = interception.response.body.category.id
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Create category', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/enums/categories/'
				}).as('createCategory')
				cy.wait('@getCategories').then((interceptorGetCategories: any) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					cy.get(`.ant-tree-treenode.${industryID} .ant-tree-node-content-wrapper`).click()
					cy.get(`#${FORM.CATEGORY}-create-subcategory-button`).click()
					cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.category.create.title)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
					cy.wait('@createCategory').then((interception: any) => {
						// check status code of request
						expect(interception.response.statusCode).to.equal(200)
						categoryID = interception.response.body.category.id
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Create service', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/enums/categories/'
				}).as('createCategory')
				cy.wait('@getCategories').then((interceptorGetCategories: any) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
					cy.wait(200) // wait for the element to be visible
					cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-node-content-wrapper`).click()
					cy.get(`#${FORM.CATEGORY}-create-subcategory-button`).click()
					cy.selectOptionDropdownCustom(FORM.CATEGORY, 'categoryParameterID')
					cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.service.create.title)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
					cy.wait('@createCategory').then((interception: any) => {
						// check status code of request
						expect(interception.response.statusCode).to.equal(200)
						serviceID = interception.response.body.category.id
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})

	context('Update', () => {
		it('Update industry', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/enums/categories/${industryID}`
				}).as('updateCategory')
				cy.wait('@getCategories').then((interceptorGetCategories: any) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					cy.get(`.ant-tree-treenode.${industryID} .ant-tree-node-content-wrapper`).click()
					cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.industry.update.title, false, true)
					// TODO: test upload of new images
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
					cy.wait('@updateCategory').then((interceptionUpdateCategory: any) => {
						// check status code of request
						expect(interceptionUpdateCategory.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Update category', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/enums/categories/${categoryID}`
				}).as('updateCategory')
				cy.wait('@getCategories').then((interceptorGetCategories: any) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
					cy.wait(200) // wait for the element to be visible
					cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-node-content-wrapper`).click()
					cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.category.update.title, false, true)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
					cy.wait('@updateCategory').then((interception: any) => {
						// check status code of request
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Update service', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/enums/categories/${serviceID}`
				}).as('updateCategory')
				cy.wait('@getCategories').then((interceptorGetCategories: any) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
					cy.wait(200) // wait for the element to be visible
					cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-switcher`).click()
					cy.wait(200) // wait for the element to be visible
					cy.get(`.ant-tree-treenode.${serviceID} .ant-tree-node-content-wrapper`).click()
					cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.service.update.title, false, true)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
					cy.wait('@updateCategory').then((interception: any) => {
						// check status code of request
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})

	context('Delete', () => {
		it('Delete service', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'DELETE',
					url: `/api/b2b/admin/enums/categories/${serviceID}`
				}).as('deleteCategory')
				cy.wait('@getCategories').then((interceptorGetCategories: any) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
					cy.wait(200) // wait for the element to be visible
					cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-switcher`).click()
					cy.wait(200) // wait for the element to be visible
					cy.get(`.ant-tree-treenode.${serviceID} .ant-tree-node-content-wrapper`).click()
					cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY)
					cy.wait('@deleteCategory').then((interception: any) => {
						// check status code of request
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Delete category', () => {
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/enums/categories/'
			}).as('getCategories')
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/enums/categories/${categoryID}`
			}).as('deleteCategory')
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
				cy.wait('@getCategories').then((interceptorGetCategories: any) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
					cy.wait(200) // wait for the element to be visible
					cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-node-content-wrapper`).click()
					cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY)
					cy.wait('@deleteCategory').then((interception: any) => {
						// check status code of request
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Delete industry', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'DELETE',
					url: `/api/b2b/admin/enums/categories/${industryID}`
				}).as('deleteCategory')
				cy.wait('@getCategories').then((interceptorGetCategories: any) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					cy.get(`.ant-tree-treenode.${industryID} .ant-tree-node-content-wrapper`).click()
					cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY)
					cy.wait('@deleteCategory').then((interception: any) => {
						// check status code of request
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default categoriesCRUDTestSuite
