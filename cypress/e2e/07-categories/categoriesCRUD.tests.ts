import { loginViaApi } from '../../support/e2e'

import category from '../../fixtures/category.json'

// enums
import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const categoriesCRUDTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	let industryID: any
	let categoryID: any
	let serviceID: any
	let hasPermissionToEdit = true

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
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/category-parameters/'
				}).as('getCategoryParameters')
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/enums/categories/'
				}).as('createCategory')
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					cy.clickButton(CREATE_BUTTON_ID, FORM.CATEGORY)
					if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
						cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.industry.create.title)
						cy.uploadFile('image', '../images/test.jpg', FORM.CATEGORY)
						cy.uploadFile('icon', '../images/test.jpg', FORM.CATEGORY)
						// wait for file to be uploaded
						cy.wait(4000).then(() => {
							cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
							cy.wait('@createCategory').then((interception: any) => {
								// check status code of request
								expect(interception.response.statusCode).to.equal(200)
								industryID = interception.response.body.category.id
								// check conf toast message
								cy.checkSuccessToastMessage()
							})
						})
					} else {
						cy.checkForbiddenModal()
						// user cannot create a parent category, so he is not able to create any subcategory either
						hasPermissionToEdit = false
					}
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Create category', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/category-parameters/'
				}).as('getCategoryParameters')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/categories/*'
				}).as('getCategoryDetail')
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/enums/categories/'
				}).as('createCategory')
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					if (hasPermissionToEdit) {
						// user has permission to create a category in the industry created in the previous test
						cy.get(`.ant-tree-treenode.${industryID} .ant-tree-node-content-wrapper`).click()
						cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
							expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)

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
						// find first industry and check forbidden modal
						cy.get('main.ant-layout-content').then(($body) => {
							if ($body.find('.noti-tree-node-level-0:first').length) {
								cy.get('.noti-tree-node-level-0:first .ant-tree-node-content-wrapper').click()
								cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
									expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
									cy.get(`#${FORM.CATEGORY}-create-subcategory-button`).click()
									cy.checkForbiddenModal()
								})
							}
						})
					}
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Create service', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/category-parameters/'
				}).as('getCategoryParameters')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/categories/*'
				}).as('getCategoryDetail')
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/enums/categories/'
				}).as('createCategory')
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					if (hasPermissionToEdit) {
						cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
						// wait for the element to be visible
						cy.wait(500).then(() => {
							cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-node-content-wrapper`).click()
							cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
								expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)

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
						})
					} else {
						cy.get('main.ant-layout-content').then(($body) => {
							if ($body.find('.noti-tree-node-level-0:first').length) {
								// find first category of first industry and check forbidden modal
								cy.get('.noti-tree-node-level-0:first .ant-tree-switcher').click()
								// wait for the element to be visible
								cy.wait(500).then(() => {
									if ($body.find('.noti-tree-node-level-1:first').length) {
										cy.get('.noti-tree-node-level-1:first .ant-tree-node-content-wrapper').click()
										cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
											expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
											cy.get(`#${FORM.CATEGORY}-create-subcategory-button`).click()
											cy.checkForbiddenModal()
										})
									}
								})
							}
						})
					}
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
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/category-parameters/'
				}).as('getCategoryParameters')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/categories/*'
				}).as('getCategoryDetail')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/enums/categories/${industryID}`
				}).as('updateCategory')
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					if (hasPermissionToEdit) {
						cy.get(`.ant-tree-treenode.${industryID} .ant-tree-node-content-wrapper`).click()
						cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
							expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
							cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.industry.update.title, false, true)
							cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
							cy.wait('@updateCategory').then((interceptionUpdateCategory: any) => {
								// check status code of request
								expect(interceptionUpdateCategory.response.statusCode).to.equal(200)
								// check conf toast message
								cy.checkSuccessToastMessage()
							})
						})
					} else {
						// find first industry and check forbidden modal
						cy.get('main.ant-layout-content').then(($body) => {
							if ($body.find('.noti-tree-node-level-0:first').length) {
								cy.get('.noti-tree-node-level-0:first .ant-tree-node-content-wrapper').click()
								cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
									expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
									cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.industry.update.title, false, true)
									cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
									cy.checkForbiddenModal()
								})
							}
						})
					}
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Update category', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/category-parameters/'
				}).as('getCategoryParameters')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/categories/*'
				}).as('getCategoryDetail')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/enums/categories/${categoryID}`
				}).as('updateCategory')
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					if (hasPermissionToEdit) {
						cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
						// wait for the element to be visible
						cy.wait(500).then(() => {
							cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-node-content-wrapper`).click()
							cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
								expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
								cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.category.update.title, false, true)
								cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
								cy.wait('@updateCategory').then((interception: any) => {
									// check status code of request
									expect(interception.response.statusCode).to.equal(200)
									// check conf toast message
									cy.checkSuccessToastMessage()
								})
							})
						})
					} else {
						cy.get('main.ant-layout-content').then(($body) => {
							if ($body.find('.noti-tree-node-level-0:first').length) {
								// find first category of first industry and check forbidden modal
								cy.get('.noti-tree-node-level-0:first .ant-tree-switcher').click()
								// wait for the element to be visible
								cy.wait(500).then(() => {
									if ($body.find('.noti-tree-node-level-1:first').length) {
										cy.get('.noti-tree-node-level-1:first .ant-tree-node-content-wrapper').click()
										cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
											expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
											cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.service.update.title, false, true)
											cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
											cy.checkForbiddenModal()
										})
									}
								})
							}
						})
					}
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Update service', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/category-parameters/'
				}).as('getCategoryParameters')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/categories/*'
				}).as('getCategoryDetail')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/enums/categories/${serviceID}`
				}).as('updateCategory')
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					if (hasPermissionToEdit) {
						cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
						// wait for the element to be visible
						cy.wait(500).then(() => {
							cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-switcher`).click()
							// wait for the element to be visible
							cy.wait(500).then(() => {
								cy.get(`.ant-tree-treenode.${serviceID} .ant-tree-node-content-wrapper`).click()
								cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
									expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)

									cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.service.update.title, false, true)
									cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
									cy.wait('@updateCategory').then((interception: any) => {
										// check status code of request
										expect(interception.response.statusCode).to.equal(200)
										// check conf toast message
										cy.checkSuccessToastMessage()
									})
								})
							})
						})
					} else {
						cy.get('main.ant-layout-content').then(($body) => {
							if ($body.find('.noti-tree-node-level-0:first').length) {
								// find first category of first industry and check forbidden modal
								cy.get('.noti-tree-node-level-0:first .ant-tree-switcher').click()
								// wait for the element to be visible
								cy.wait(500).then(() => {
									if ($body.find('.noti-tree-node-level-1:first').length) {
										cy.get('.noti-tree-node-level-1:first .ant-tree-switcher').click()
										// wait for the element to be visible
										cy.wait(500).then(() => {
											if ($body.find('.noti-tree-node-level-2:first').length) {
												cy.get('.noti-tree-node-level-2:first .ant-tree-node-content-wrapper').click()
												cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
													expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
													cy.setInputValue(FORM.CATEGORY, 'nameLocalizations-0-value', category.service.update.title, false, true)
													cy.clickButton(SUBMIT_BUTTON_ID, FORM.CATEGORY)
													cy.checkForbiddenModal()
												})
											}
										})
									}
								})
							}
						})
					}
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
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/category-parameters/'
				}).as('getCategoryParameters')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/categories/*'
				}).as('getCategoryDetail')
				cy.intercept({
					method: 'DELETE',
					url: `/api/b2b/admin/enums/categories/${serviceID}`
				}).as('deleteCategory')
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					if (hasPermissionToEdit) {
						cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
						// wait for the element to be visible
						cy.wait(500).then(() => {
							cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-switcher`).click()
							// wait for the element to be visible
							cy.wait(500).then(() => {
								cy.get(`.ant-tree-treenode.${serviceID} .ant-tree-node-content-wrapper`).click()
								cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
									expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
									cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY)
									cy.wait('@deleteCategory').then((interception: any) => {
										// check status code of request
										expect(interception.response.statusCode).to.equal(200)
										// check conf toast message
										cy.checkSuccessToastMessage()
									})
								})
							})
						})
					} else {
						cy.get('main.ant-layout-content').then(($body) => {
							if ($body.find('.noti-tree-node-level-0:first').length) {
								// find first category of first industry and check forbidden modal
								cy.get('.noti-tree-node-level-0:first .ant-tree-switcher').click()
								// wait for the element to be visible
								cy.wait(500).then(() => {
									if ($body.find('.noti-tree-node-level-1:first').length) {
										cy.get('.noti-tree-node-level-1:first .ant-tree-switcher').click()
										// wait for the element to be visible
										cy.wait(500).then(() => {
											if ($body.find('.noti-tree-node-level-2:first').length) {
												cy.get('.noti-tree-node-level-2:first .ant-tree-node-content-wrapper').click()
												cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
													expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
													cy.get(`#${FORM.CATEGORY}-delete-btn`).click()
													cy.checkForbiddenModal()
												})
											}
										})
									}
								})
							}
						})
					}
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
				method: 'GET',
				pathname: '/api/b2b/admin/enums/category-parameters/'
			}).as('getCategoryParameters')
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/enums/categories/*'
			}).as('getCategoryDetail')
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/enums/categories/${categoryID}`
			}).as('deleteCategory')
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					if (hasPermissionToEdit) {
						cy.get(`.ant-tree-treenode.${industryID} .ant-tree-switcher`).click()
						// wait for the element to be visible
						cy.wait(500).then(() => {
							cy.get(`.ant-tree-treenode.${categoryID} .ant-tree-node-content-wrapper`).click()
							cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
								expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
								cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY)
								cy.wait('@deleteCategory').then((interception: any) => {
									// check status code of request
									expect(interception.response.statusCode).to.equal(200)
									// check conf toast message
									cy.checkSuccessToastMessage()
								})
							})
						})
					} else {
						cy.get('main.ant-layout-content').then(($body) => {
							if ($body.find('.noti-tree-node-level-0:first').length) {
								// find first category of first industry and check forbidden modal
								cy.get('.noti-tree-node-level-0:first .ant-tree-switcher').click()
								// wait for the element to be visible
								cy.wait(500).then(() => {
									if ($body.find('.noti-tree-node-level-1:first').length) {
										cy.get('.noti-tree-node-level-1:first .ant-tree-node-content-wrapper').click()
										cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
											expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
											cy.get(`#${FORM.CATEGORY}-delete-btn`).click()
											cy.checkForbiddenModal()
										})
									}
								})
							}
						})
					}
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Delete industry', () => {
			cy.visit('/categories')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/enums/categories/'
				}).as('getCategories')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/category-parameters/'
				}).as('getCategoryParameters')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/enums/categories/*'
				}).as('getCategoryDetail')
				cy.intercept({
					method: 'DELETE',
					url: `/api/b2b/admin/enums/categories/${industryID}`
				}).as('deleteCategory')
				cy.wait(['@getCategories', '@getCategoryParameters']).then(([interceptorGetCategories, interceptorGetCategoryParameters]: any[]) => {
					expect(interceptorGetCategories.response.statusCode).to.equal(200)
					expect(interceptorGetCategoryParameters.response.statusCode).to.equal(200)

					if (hasPermissionToEdit) {
						cy.get(`.ant-tree-treenode.${industryID} .ant-tree-node-content-wrapper`).click()
						cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
							expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
							cy.clickDeleteButtonWithConfCustom(FORM.CATEGORY)
							cy.wait('@deleteCategory').then((interception: any) => {
								// check status code of request
								expect(interception.response.statusCode).to.equal(200)
								// check conf toast message
								cy.checkSuccessToastMessage()
							})
						})
					} else {
						// find first industry and check forbidden modal
						cy.get('main.ant-layout-content').then(($body) => {
							if ($body.find('.noti-tree-node-level-0:first').length) {
								cy.get('.noti-tree-node-level-0:first .ant-tree-node-content-wrapper').click()
								cy.wait('@getCategoryDetail').then((interceptionGetCategoryDetail: any) => {
									expect(interceptionGetCategoryDetail.response.statusCode).to.equal(200)
									cy.get(`#${FORM.CATEGORY}-delete-btn`).click()
									cy.checkForbiddenModal()
								})
							}
						})
					}
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default categoriesCRUDTestSuite
