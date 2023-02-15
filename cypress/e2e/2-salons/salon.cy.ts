// utils
import { FORM } from '../../../src/utils/enums'

// fixtures
import salon from '../../fixtures/salon.json'
import customer from '../../fixtures/customer.json'
import user from '../../fixtures/user.json'

// support
import { generateRandomInt, generateRandomString, getCategoryById } from '../../support/helpers'

describe('Salons', () => {
	let createdSalonID: any
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	context('Create', () => {
		it('Create salon', () => {
			// prepare image for upload
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/salons'
			}).as('createSalon')
			cy.visit('/salons/create')
			cy.setInputValue(FORM.SALON, 'name', salon.create.name)
			cy.uploadFile('gallery', '../images/test.jpg', FORM.SALON)
			cy.setInputValue(FORM.SALON, 'phones-0-phone', salon.create.phone)
			cy.setInputValue(FORM.SALON, 'email', `${generateRandomString(6)}_${salon.create.emailSuffix}`)
			cy.get('.content-body').then(($body) => {
				// check if google map working
				if ($body.find('.google-map-warning').length) {
					cy.log('Google map is unavailable!')
					cy.setInputValue(FORM.SALON, 'street', salon.create.street)
					cy.setInputValue(FORM.SALON, 'streetNumber', salon.create.streetNumber)
					cy.setInputValue(FORM.SALON, 'city', salon.create.city)
					cy.setInputValue(FORM.SALON, 'zipCode', salon.create.zipCode)
					cy.setInputValue(FORM.SALON, 'longitude', salon.create.lon)
					cy.setInputValue(FORM.SALON, 'latitude', salon.create.lat)
					// country is in EN -> in this point of test can fail due to language on test environment
					cy.selectOptionDropdownCustom(FORM.SALON, 'country', salon.create.country, true)
				} else {
					// else google map and search box working
					cy.setSearchBoxValueAndSelectFirstOption('address', salon.create.address, '.pac-item', FORM.SALON, true, undefined, 8000)
				}
			})
			cy.setInputValue(FORM.SALON, 'otherPaymentMethods', salon.create.paymentMethods)
			cy.clickButton('payByCard', FORM.SALON, true)
			cy.get('form').submit()
			cy.wait('@createSalon').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				createdSalonID = interception.response.body.salon.id
				// cy.setLocalStorage('salonID', createdSalonID)
				cy.location('pathname').should('eq', `/salons/${createdSalonID}`)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	/* context('Billing information', () => {
		it('Update billing information', () => {
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${createdSalonID}/invoice`
			}).as('updateBillingInfo')
			cy.visit(`/salons/${createdSalonID}/billing-info`)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'companyName', salon.billingInfo.companyName)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'businessID', salon.billingInfo.businessID)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'vatID', salon.billingInfo.vatID)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'taxID', salon.billingInfo.taxID)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'firstName', salon.billingInfo.firstName)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'lastName', salon.billingInfo.lastName)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'email', `${generateRandomString(6)}_${salon.billingInfo.emailSuffix}`)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'phone', salon.billingInfo.phone)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'street', salon.billingInfo.street)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'streetNumber', salon.billingInfo.streetNumber)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'city', salon.billingInfo.city)
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'zipCode', salon.billingInfo.zipCode)
			cy.get('form').submit()
			cy.wait('@updateBillingInfo').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	context('Customer CRUD operations', () => {
		// id of customer
		let customerID = 0

		it('Create customer', () => {
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/customers'
			}).as('createCustomer')
			cy.visit(`/salons/${createdSalonID}/customers/create`)
			cy.selectOptionDropdown(FORM.CUSTOMER, 'countryCode')
			cy.setInputValue(FORM.CUSTOMER, 'firstName', generateRandomString(6))
			cy.setInputValue(FORM.CUSTOMER, 'lastName', generateRandomString(6))
			cy.selectOptionDropdown(FORM.CUSTOMER, 'gender')
			cy.setInputValue(FORM.CUSTOMER, 'email', `${generateRandomString(6)}_${customer.create.emailSuffix}`)
			cy.setInputValue(FORM.CUSTOMER, 'phone', customer.create.phone)
			cy.uploadFile('gallery', '../images/test.jpg', FORM.CUSTOMER)
			cy.setInputValue(FORM.CUSTOMER, 'street', customer.create.street)
			cy.setInputValue(FORM.CUSTOMER, 'streetNumber', customer.create.streetNumber)
			cy.setInputValue(FORM.CUSTOMER, 'city', generateRandomString(7))
			cy.setInputValue(FORM.CUSTOMER, 'zipCode', generateRandomInt(5).toString())
			cy.get('form').submit()
			cy.wait('@createCustomer').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				customerID = interception.response.body.customer.id
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})

		it('Update customer', () => {
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/customers/${customerID}`
			}).as('updateCustomer')
			cy.visit(`/salons/${createdSalonID}/customers/${customerID}`)
			const firstName = generateRandomString(7)
			cy.setInputValue(FORM.CUSTOMER, 'firstName', firstName, false, true)
			cy.setInputValue(FORM.CUSTOMER, 'lastName', generateRandomString(10), false, true)
			cy.clearDropdownSelection('gender')
			cy.setInputValue(FORM.CUSTOMER, 'email', `${generateRandomString(6)}_${customer.update.emailSuffix}`, false, true)
			cy.setInputValue(FORM.CUSTOMER, 'phone', customer.update.phone, false, true)
			cy.setInputValue(FORM.CUSTOMER, 'street', customer.update.street, false, true)
			cy.setInputValue(FORM.CUSTOMER, 'streetNumber', customer.update.streetNumber, false, true)
			cy.setInputValue(FORM.CUSTOMER, 'city', generateRandomString(7), false, true)
			cy.setInputValue(FORM.CUSTOMER, 'zipCode', generateRandomInt(5).toString(), false, true)

			cy.get('form').submit()
			cy.wait('@updateCustomer').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})

		it('Delete customer', () => {
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/customers/${customerID}`
			}).as('deleteCustomer')
			cy.visit(`/salons/${createdSalonID}/customers/${customerID}`)
			cy.clickDeleteButtonWithConfCustom(FORM.CUSTOMER)
			cy.wait('@deleteCustomer').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
				cy.location('pathname').should('eq', `/salons/${createdSalonID}/customers`)
			})
		})
	})

	context('Employee CRUD operations', () => {
		// id of customer
		let employeeID = 0

		it('Create employee', () => {
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/employees'
			}).as('createEmployee')
			cy.visit(`/salons/${createdSalonID}/employees/create`)
			cy.setInputValue(FORM.EMPLOYEE, 'firstName', generateRandomString(6))
			cy.setInputValue(FORM.EMPLOYEE, 'lastName', generateRandomString(6))
			cy.setInputValue(FORM.EMPLOYEE, 'email', `${generateRandomString(6)}_${user.emailSuffix}`)
			cy.setInputValue(FORM.EMPLOYEE, 'phone', customer.create.phone)
			cy.get(`#${FORM.EMPLOYEE}-form`).submit()
			cy.wait('@createEmployee').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				employeeID = interception.response.body.employee.id
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})

		it('Update employee', () => {
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/employees/${employeeID}`
			}).as('updateEmployee')
			cy.visit(`/salons/${createdSalonID}/employees/${employeeID}`)
			cy.setInputValue(FORM.EMPLOYEE, 'firstName', generateRandomString(6), false, true)
			cy.setInputValue(FORM.EMPLOYEE, 'lastName', generateRandomString(6), false, true)
			cy.setInputValue(FORM.EMPLOYEE, 'email', `${generateRandomString(6)}_${customer.create.emailSuffix}`, false, true)
			cy.setInputValue(FORM.EMPLOYEE, 'phone', customer.create.phone, false, true)
			cy.get(`#${FORM.EMPLOYEE}-form`).submit()
			cy.wait('@updateEmployee').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})

		it('Delete employee', () => {
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/employees/${employeeID}`
			}).as('deleteEmployee')
			cy.visit(`/salons/${createdSalonID}/employees/${employeeID}`)
			cy.clickDeleteButtonWithConfCustom(FORM.EMPLOYEE)
			cy.wait('@deleteEmployee').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
				cy.location('pathname').should('eq', `/salons/${createdSalonID}/employees`)
			})
		})
	}) */

	context('Industries and services CRUD operations', () => {
		it('Update industries and industry services', () => {
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/enums/categories/'
			}).as('getCategories')
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${createdSalonID}/categories`
			}).as('patchSalonCategories')
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${createdSalonID}/services`
			}).as('patchSalonServices')
			cy.visit(`/salons/${createdSalonID}/industries-and-services`)
			cy.wait('@getCategories').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// TODO: ak pride prazdne pole, tak nerobit request - zisti ako sa to da spravit, klasicky if nefunguje
				// if (interception.response.body.categories?.length) {
				cy.get('.checkbox-group-image-wrapper > .checkbox-with-image:first > label').as('firstIndustryLabel')
				cy.get('@firstIndustryLabel').find('input[type="checkbox"]').should('have.id', interception.response.body.categories[0].id)
				cy.get('@firstIndustryLabel').find('.inner-wrapper').click({ force: true })
				cy.get(`#${FORM.INDUSTRIES}-form`).submit()
				cy.wait('@patchSalonCategories').then((interceptionPatchSalonCategories: any) => {
					// check status code
					expect(interceptionPatchSalonCategories.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
					cy.get('.checkbox-group-image-wrapper > .checkbox-with-image:first > button').click()
					cy.wait('@getCategories').then((intercepitonGetCategoriesInDetail: any) => {
						// check status code
						expect(intercepitonGetCategoriesInDetail.response.statusCode).to.equal(200)
						cy.get('.noti-tree-node-0 > .ant-tree-node-content-wrapper').click({ force: true })
						cy.get(`#${FORM.INDUSTRY}-form`).submit()
						cy.wait('@patchSalonServices').then((interceptionPatchSalonCategory: any) => {
							// check status code
							expect(interceptionPatchSalonCategory.response.statusCode).to.equal(200)
							// check conf toast message
							cy.checkSuccessToastMessage()
						})
					})
				})
			})
		})

		it('Update service settings', () => {
			let serviceID: any
			let categoryID: any
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/services/',
				query: {
					salonID: createdSalonID
				}
			}).as('getSalonServices')
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/services/${serviceID}`
			}).as('getSalonService')
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/enums/categories/${categoryID}`
			}).as('getCategory')
			cy.visit(`/salons/${createdSalonID}/services-settings`)
			cy.wait('@getSalonServices').then((interceptorGetSalonServices: any) => {
				// check status code
				expect(interceptorGetSalonServices.response.statusCode).to.equal(200)
				// TODO: check for length
				cy.get('.ant-table-row:first')
					.as('firstRow')
					.invoke('attr', 'data-row-key')
					.then((dataRowKey) => {
						const ids = (dataRowKey || '').split('_')
						// eslint-disable-next-line prefer-destructuring
						categoryID = ids[0]
						// eslint-disable-next-line prefer-destructuring
						serviceID = ids[1]

						cy.get('@firstRow').click()
						cy.wait(['@getSalonService', '@getCategory']).then(([interceptorGetSalonSerivce, interceptorGetCategory]: any[]) => {
							// check status code
							expect(interceptorGetSalonSerivce.response.statusCode).to.equal(200)
							expect(interceptorGetSalonSerivce.response.body.service.id).to.equal(serviceID)
							expect(interceptorGetCategory.response.statusCode).to.equal(200)
							expect(interceptorGetCategory.response.body.category.id).to.equal(categoryID)
						})
					})
			})
		})
	})

	context('Update and delete', () => {
		it('Update created salon', () => {
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${createdSalonID}`
			}).as('updateSalon')
			cy.visit(`/salons/${createdSalonID}`)
			cy.setInputValue(FORM.SALON, 'name', salon.update.name, false, true)
			cy.setInputValue(FORM.SALON, 'socialLinkWebPage', salon.update.socialLinkWebPage)
			cy.setInputValue(FORM.SALON, 'socialLinkFB', salon.update.socialLinkFB)
			cy.get('form').submit()
			cy.wait('@updateSalon').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})

		it('Delete created salon', () => {
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/salons/${createdSalonID}`
			}).as('deleteSalon')
			cy.visit(`/salons/${createdSalonID}`)
			// wait duw to animations and fetch data
			cy.wait(5000)
			cy.clickDeleteButtonWithConfCustom(FORM.SALON)
			cy.wait('@deleteSalon').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
				cy.location('pathname').should('eq', `/salons`)
			})
		})
	})
})
