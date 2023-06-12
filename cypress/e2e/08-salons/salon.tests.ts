import { loginViaApi } from '../../support/e2e'
import { generateRandomString } from '../../support/helpers'

// eslint-disable-next-line import/no-cycle
import { ITests } from '../13-roles/roles.cy'

// fixtures
import salon from '../../fixtures/salon.json'

// enums
import { DELETE_BUTTON_ID, FORM, PAGE, PERMISSION, SALON_ROLES, SALON_TABS_KEYS, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS, SALON_TESTS_SUITS, SALON_ID } from '../../enums'

// test suits
import billingInformationTestSuite from './billingInformation.tests'
import customerTestSuite, { deleteCustomer } from './customers.tests'
import employeeTestSuite, { deleteEmployee } from './employee.tests'
import industriesAndServicesTestSuite from './industriesAndServices.tests'
import reservationsTestSuite from './reservations.tests'
import smsCreditTestSuite from './smsCredit.tests'
import salonApprovalProcessTestSuite from './salonApprovalProcess.tests'
import importDataTestSuite from './importData.tests'

const salonTestSuite = (actions: CRUD_OPERATIONS[], tests: ITests[], role: SALON_ROLES | PERMISSION, email?: string, password?: string): void => {
	context('Salon', () => {
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

		// skip salon create for user with salon role
		if (!(role in SALON_ROLES)) {
			it('Create salon', () => {
				// prepare image for upload
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/salons'
				}).as('createSalon')
				cy.visit('/salons/create')
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
					// visit specialsit modal
					cy.get('.noti-specialist-button').trigger('mouseover').click({ force: true })
					// wait for animations
					cy.wait(2000)
					cy.selectOptionDropdownCustom(undefined, 'noti-specialist-select', undefined, true)
					cy.get('.noti-specialist-modal-content > header > button').click()
					// fill up the salon form
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
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.SALON)
					cy.wait('@createSalon').then((interception: any) => {
						// check status code
						expect(interception.response.statusCode).to.equal(200)
						const salonID = interception.response.body.salon.id
						Cypress.env(SALON_ID, salonID)
						// cy.setLocalStorage('salonID', createdSalonID)
						cy.location('pathname').should('eq', `/salons/${salonID}`)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				} else {
					// check redirect to 403 not allowed page
					cy.location('pathname').should('eq', '/403')
				}
			})
		} else if (role in SALON_ROLES) {
			// check if logged user have salon roles
			it('Open salon detail', () => {
				// get salonID for user with salon roles
				cy.intercept({
					method: 'GET',
					url: '/api/b2b/admin/salons/*'
				}).as('getSalon')
				cy.visit('/')
				cy.wait(5000)
				cy.get(`#${PAGE.SALONS}`).click()
				cy.wait('@getSalon').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					const salonID = interception.response.body.salon.id
					Cypress.env(SALON_ID, salonID)
					cy.location('pathname').should('eq', `/salons/${salonID}`)
					cy.log(`SALON_ID: ${salonID}`)
				})
			})
		}

		it('Update salon', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${salonID}`
			}).as('updateSalon')
			cy.visit(`/salons/${salonID}`)
			// change input name for both cases
			cy.setInputValue(FORM.SALON, 'name', salon.update.name, false, true)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.setInputValue(FORM.SALON, 'socialLinkWebPage', salon.update.socialLinkWebPage, false, true)
				cy.setInputValue(FORM.SALON, 'socialLinkFB', salon.update.socialLinkFB, false, true)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.SALON)
				cy.wait('@updateSalon').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			} else {
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.SALON)
				cy.checkForbiddenModal()
			}
		})

		// test suites depending on salon
		context('Salon sub test suites', () => {
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

			tests.forEach((test) => {
				switch (test.name) {
					case SALON_TESTS_SUITS.BILLING_INFORMATION:
						billingInformationTestSuite(test.actions)
						break
					case SALON_TESTS_SUITS.CUSTOMER:
						customerTestSuite(test.actions)
						break
					case SALON_TESTS_SUITS.EMPLOYEE:
						employeeTestSuite(test.actions)
						break
					case SALON_TESTS_SUITS.INDUSTRIES_AND_SERVICES:
						industriesAndServicesTestSuite(test.actions)
						break
					case SALON_TESTS_SUITS.RESERVATIONS:
						reservationsTestSuite(test.actions)
						break
					case SALON_TESTS_SUITS.SMS_CREDIT:
						smsCreditTestSuite(test.actions)
						break
					case SALON_TESTS_SUITS.IMPORT_DATA:
						importDataTestSuite(test.actions)
						break
					default:
				}
			})
		})

		// Salon approval process
		salonApprovalProcessTestSuite(actions, role, email, password)

		// History
		context('Salon history', () => {
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

			it('Visit salon history', () => {
				// get salonID from env
				const salonID = Cypress.env(SALON_ID)
				cy.intercept({
					method: 'GET',
					pathname: `/api/b2b/admin/salons/${salonID}/history`
				}).as('getSalonHistory')
				cy.visit(`/salons/${salonID}`)
				// skip for user with Salon roles - they can't see this tab
				if ((actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) && !(role in SALON_ROLES)) {
					cy.get('main.ant-layout-content').then(($body) => {
						if ($body.find(`[data-node-key="${SALON_TABS_KEYS.SALON_HISTORY}"]`).length) {
							cy.clickTab(SALON_TABS_KEYS.SALON_HISTORY)
							cy.wait('@getSalonHistory').then((interceptionGetSalonHistory: any) => {
								expect(interceptionGetSalonHistory.response.statusCode).to.equal(200)
								// update range of history data
								cy.get(`#${FORM.SALON_HISTORY_FILTER}-dateFromTo`).find('input').first().as('dateFrom')
								cy.get('@dateFrom').scrollIntoView()
								cy.get('@dateFrom').click({ force: true })
								cy.get('.ant-picker-dropdown :not(.ant-picker-dropdown-hidden)', { timeout: 2000 })
									.find('.ant-picker-presets > ul > li')
									.first()
									.click({ force: true })
								cy.wait('@getSalonHistory').then((interceptionGetSalonHistoryWithDifferentRange: any) => {
									expect(interceptionGetSalonHistoryWithDifferentRange.response.statusCode).to.equal(200)
								})
							})
						}
					})
				}
			})
		})

		// clear testing data
		context('Delete operations', () => {
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

			// check for actions in tests array for specific enumerations
			const testForCustomer = tests.find((test) => test.name === SALON_TESTS_SUITS.CUSTOMER)
			if (testForCustomer) deleteCustomer(testForCustomer.actions)

			const testForEmployee = tests.find((test) => test.name === SALON_TESTS_SUITS.EMPLOYEE)
			if (testForEmployee) deleteEmployee(testForEmployee.actions)

			it('Delete salon', () => {
				// get salonID from env
				const salonID = Cypress.env(SALON_ID)
				cy.intercept({
					method: 'DELETE',
					url: `/api/b2b/admin/salons/${salonID}`
				}).as('deleteSalon')
				cy.visit(`/salons/${salonID}`)
				// wait due to animations and fetch data
				cy.wait(5000)
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
					cy.clickDeleteButtonWithConfCustom(FORM.SALON)
					cy.wait('@deleteSalon').then((interception: any) => {
						// check status code
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				} else {
					cy.clickButton(DELETE_BUTTON_ID, FORM.SALON)
					cy.checkForbiddenModal()
				}
			})
		})
	})
}

export default salonTestSuite
