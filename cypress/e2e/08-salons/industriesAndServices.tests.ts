import { CRUD_OPERATIONS, SALON_ID } from '../../enums'
import { FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

import service from '../../fixtures/service.json'

import { generateElementId } from '../../support/helpers'

const industriesAndServicesTestSuite = (actions: CRUD_OPERATIONS[]): void => {
	context('Industries and services', () => {
		it('Update industries and industry services', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/enums/categories/'
			}).as('getCategories')
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/services/',
				query: {
					salonID
				}
			}).as('getSalonServices')
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${salonID}/categories`
			}).as('patchSalonCategories')
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${salonID}/services`
			}).as('patchSalonServices')
			cy.visit(`/salons/${salonID}/industries-and-services`)
			cy.wait(['@getCategories', '@getSalonServices']).then(([interceptionCategories, interceptionServices]: any[]) => {
				// check status code
				expect(interceptionCategories.response.statusCode).to.equal(200)
				expect(interceptionServices.response.statusCode).to.equal(200)
				let industryIndex = 0
				// NOTE: must exists at least 1 category that isn't checked
				cy.get('.checkbox-group-image-wrapper > .checkbox-with-image').each(($element, index) => {
					if (!$element.hasClass('checked')) {
						industryIndex = index
						cy.wrap($element).find('> label').as('industryLabel')
						cy.get('@industryLabel').find('input[type="checkbox"]').should('have.id', interceptionCategories.response.body.categories[industryIndex].id)
						cy.get('@industryLabel').find('.inner-wrapper').click({ force: true })

						// end loop
						return false
					}
					return true
				})
				// cy.clickButton(SUBMIT_BUTTON_ID, FORM.INDUSTRIES)
				cy.get(`#${FORM.INDUSTRIES}-${SUBMIT_BUTTON_ID}`).click({ force: true })
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
					cy.wait('@patchSalonCategories').then((interceptionPatchSalonCategories: any) => {
						// check status code
						expect(interceptionPatchSalonCategories.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
						cy.get('.checkbox-group-image-wrapper > .checkbox-with-image').eq(industryIndex).find('> button').click()
						cy.wait('@getCategories').then((interceptionGetCategoriesInDetail: any) => {
							// check status code
							expect(interceptionGetCategoriesInDetail.response.statusCode).to.equal(200)
							// wait for select tree to be loaded
							cy.wait(2000)
							// there must be at least two services in the industry in order to test work properly !!
							cy.get('.ant-tree-list .ant-tree-treenode').each(($treeNode, index) => {
								// we know that not everything is checked, so when we check this we are sure that salon would have some services selected
								if (index === 0 && !$treeNode.hasClass('ant-tree-treenode-checkbox-checked')) {
									cy.wrap($treeNode.find('.ant-tree-checkbox')).click({ force: true })
									return false
								}
								// if everything is checked and we know that at least two services exist, we can uncheck first of them and we still have at least one service to work with, which is neccesary for other tests to work
								// it will make changes to formular and submit button will not be disabled
								if (index === 2) {
									cy.wrap($treeNode.find('.ant-tree-checkbox')).click({ force: true })
									return false
								}
								return true
							})
							// cy.clickButton(SUBMIT_BUTTON_ID, FORM.INDUSTRY)
							cy.get(`#${FORM.INDUSTRY}-${SUBMIT_BUTTON_ID}`).click({ force: true })
							cy.wait('@patchSalonServices').then((interceptionPatchSalonCategory: any) => {
								// check status code
								expect(interceptionPatchSalonCategory.response.statusCode).to.equal(200)
								// check conf toast message
								cy.checkSuccessToastMessage()
							})
						})
					})
				} else {
					cy.checkForbiddenModal()
				}
			})
		})

		it('Update service settings', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/services/',
				query: {
					salonID
				}
			}).as('getSalonServices')
			cy.visit(`/salons/${salonID}/services-settings`)
			cy.wait('@getSalonServices').then((interceptorGetSalonServices: any) => {
				// check status code
				expect(interceptorGetSalonServices.response.statusCode).to.equal(200)
				cy.get('.ant-table-row:first')
					.as('firstRow')
					.invoke('attr', 'data-row-key')
					.then((dataRowKey) => {
						const [categoryID, serviceID] = (dataRowKey || '').split('_')

						cy.intercept({
							method: 'GET',
							url: `/api/b2b/admin/services/${serviceID}`
						}).as('getSalonService')
						cy.intercept({
							method: 'GET',
							url: `/api/b2b/admin/enums/categories/${categoryID}`
						}).as('getCategory')
						cy.intercept({
							method: 'GET',
							url: '/api/b2b/admin/enums/categories/'
						}).as('getCategories')
						cy.intercept({
							method: 'GET',
							pathname: '/api/b2b/admin/employees/',
							query: {
								page: '1',
								salonID
							}
						}).as('getEmployees')
						cy.intercept({
							method: 'PATCH',
							pathname: `/api/b2b/admin/services/${serviceID}`
						}).as('updateSalonService')

						cy.get('@firstRow').click()
						cy.wait(['@getSalonService', '@getCategory', '@getCategories', '@getEmployees']).then(
							([interceptorGetSalonSerivce, interceptorGetCategory, interceptorGetCategories, interceptorGetEmlpoyees]: any[]) => {
								// check status codes
								expect(interceptorGetSalonSerivce.response.statusCode).to.equal(200)
								expect(interceptorGetCategory.response.statusCode).to.equal(200)
								expect(interceptorGetCategories.response.statusCode).to.equal(200)
								expect(interceptorGetEmlpoyees.response.statusCode).to.equal(200)

								if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
									cy.get('main.ant-layout-content').then(($body) => {
										if ($body.find(`#${FORM.SERVICE_FORM}-useCategoryParameter`).length) {
											cy.get(`#${FORM.SERVICE_FORM}-useCategoryParameter > button`).then(($switchButton) => {
												if ($switchButton.hasClass('ant-switch-checked')) {
													cy.wrap($switchButton).click()
												}
											})
										}

										cy.get(`#${FORM.SERVICE_FORM}-variableDuration > button`).then(($switchButton) => {
											if ($switchButton.hasClass('ant-switch-checked')) {
												cy.wrap($switchButton).click()
											}
										})

										cy.get(`#${FORM.SERVICE_FORM}-variablePrice > button`).then(($switchButton) => {
											if ($switchButton.hasClass('ant-switch-checked')) {
												cy.wrap($switchButton).click()
											}
										})

										cy.setInputValue(FORM.SERVICE_FORM, 'durationFrom', service.create.durationFrom, true, true)
										cy.setInputValue(FORM.SERVICE_FORM, 'priceFrom', service.create.priceFrom, true, true)
										// add employee from Select with async search (at least one employee must exit in the salon in order to test work properly!!)
										cy.get(generateElementId('employee', FORM.SERVICE_FORM)).click()
										cy.wait('@getEmployees').then((interceptorGetEmlpoyeesSearch: any) => {
											expect(interceptorGetEmlpoyeesSearch.response.statusCode).to.equal(200)
											// select first employee from the list
											cy.get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)', { timeout: 10000 })
												.should('be.visible')
												.find('.ant-select-item-option')
												.first()
												.click({ force: true })

											cy.get(`#${FORM.SERVICE_FORM}-add-employee`).click()
											cy.clickButton(SUBMIT_BUTTON_ID, FORM.SERVICE_FORM)
											// TODO: test service with category parameter
											cy.wait('@updateSalonService').then((interceptorUpdateSalonService: any) => {
												expect(interceptorUpdateSalonService.response.statusCode).to.equal(200)
											})
										})
									})
								}
							}
						)
					})
			})
		})

		it('Update employee service settings', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/services/',
				query: {
					salonID
				}
			}).as('getSalonServices')
			cy.visit(`/salons/${salonID}/services-settings`)
			cy.wait('@getSalonServices').then((interceptorGetSalonServices: any) => {
				// check status code
				expect(interceptorGetSalonServices.response.statusCode).to.equal(200)
				cy.get('.ant-table-row:first')
					.as('firstRow')
					.invoke('attr', 'data-row-key')
					.then((dataRowKey) => {
						const [categoryID, serviceID] = (dataRowKey || '').split('_')

						cy.intercept({
							method: 'GET',
							url: `/api/b2b/admin/services/${serviceID}`
						}).as('getSalonService')
						cy.intercept({
							method: 'GET',
							url: `/api/b2b/admin/enums/categories/${categoryID}`
						}).as('getCategory')
						cy.intercept({
							method: 'GET',
							url: '/api/b2b/admin/enums/categories/'
						}).as('getCategories')
						cy.intercept({
							method: 'GET',
							pathname: '/api/b2b/admin/employees/',
							query: {
								page: '1',
								salonID
							}
						}).as('getEmployees')

						cy.get('@firstRow').click()
						cy.wait(['@getSalonService', '@getCategory', '@getCategories', '@getEmployees']).then(
							([interceptorGetSalonSerivce, interceptorGetCategory, interceptorGetCategories, interceptorGetEmlpoyees]: any[]) => {
								// check status codes
								expect(interceptorGetSalonSerivce.response.statusCode).to.equal(200)
								expect(interceptorGetCategory.response.statusCode).to.equal(200)
								expect(interceptorGetCategories.response.statusCode).to.equal(200)
								expect(interceptorGetEmlpoyees.response.statusCode).to.equal(200)

								if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
									cy.get('#service-employees-list')
										.find('.ant-collapse-item')
										.first()
										.find('.ant-collapse-extra button')
										.first()
										.as('employeeServiceEditBtn')
										.invoke('attr', 'id')
										.then((btnID) => {
											const split = (btnID || '').split('_')
											const employeeID = split[split.length - 1]

											cy.intercept({
												method: 'PATCH',
												url: `/api/b2b/admin/employees/${employeeID}/services/${serviceID}`
											}).as('updateEmployeeService')

											cy.get('@employeeServiceEditBtn').click()
											// wait for the animation
											cy.wait(1000)
											cy.setInputValue(FORM.EMPLOYEE_SERVICE_EDIT, 'employeePriceAndDurationData-durationFrom', service.employeeService.durationFrom)
											cy.setInputValue(FORM.EMPLOYEE_SERVICE_EDIT, 'employeePriceAndDurationData-priceFrom', service.employeeService.priceFrom)
											cy.clickButton(SUBMIT_BUTTON_ID, FORM.EMPLOYEE_SERVICE_EDIT)
											cy.wait('@updateEmployeeService').then((interceptorUpdateEmployeeService: any) => {
												expect(interceptorUpdateEmployeeService.response.statusCode).to.equal(200)
												// select first employee from the list
												cy.checkSuccessToastMessage()
											})
										})
								} else {
									cy.get('#service-employees-list').find('.ant-collapse-item').first().find('.ant-collapse-extra button').first().click()
									cy.checkForbiddenModal()
								}
							}
						)
					})
			})
		})

		it('Filter services settings', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/enums/categories/'
			}).as('getCategories')
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/services/',
				query: {
					salonID
				}
			}).as('getSalonServices')
			cy.visit(`/salons/${salonID}/services-settings`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait(['@getCategories', '@getSalonServices']).then(([interceptionCategories, interceptionServices]: any[]) => {
					// check status code
					expect(interceptionCategories.response.statusCode).to.equal(200)
					expect(interceptionServices.response.statusCode).to.equal(200)
					cy.selectOptionDropdownCustom(FORM.SERVICES_FILTER, 'rootCategoryID', undefined, true)
					cy.wait('@getSalonServices').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default industriesAndServicesTestSuite
