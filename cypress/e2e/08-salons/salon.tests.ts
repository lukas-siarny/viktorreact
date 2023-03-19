import { loginViaApi } from '../../support/e2e'
import { generateRandomString } from '../../support/helpers'

// eslint-disable-next-line import/no-cycle
import { ITests } from '../11-roles/roles.cy'

// fixtures
import salon from '../../fixtures/salon.json'

// enums
import { DELETE_BUTTON_ID, FORM, PAGE, PERMISSION, SALON_ROLES, SUBMIT_BUTTON_ID, TAB_KEYS } from '../../../src/utils/enums'
import { CRUD_OPERATIONS, SALON_TESTS_SUITS, SALON_ID } from '../../enums'

// test suits
import billingInformationTestSuite from './billingInformation.tests'
import customerTestSuite, { deleteCustomer } from './customers.tests'
import employeeTestSuite, { deleteEmployee } from './employee.tests'
import industriesAndServicesTestSuite from './industriesAndServices.tests'
import reservationsTestSuite from './reservations.test'
import smsCreditTestSuite from './smsCredit.tests'

const salonTestSuite = (actions: CRUD_OPERATIONS[], tests: ITests[], role: SALON_ROLES | PERMISSION, email?: string, password?: string): void => {
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

	context('Salon', () => {
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
					// check redirect to 404 notfound page
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
					default:
				}
			})
		})

		context('Salon approval process', () => {
			it('Request salon publication', () => {
				// get salonID from env
				const salonID = Cypress.env(SALON_ID)
				cy.intercept({
					method: 'GET',
					url: `/api/b2b/admin/salons/${salonID}`
				}).as('getSalonDetail')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/salons/${salonID}/request-publication`
				}).as('requestSalonPublication')
				cy.visit(`/salons/${salonID}`)
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
					// NOTE: roles that don't have permissions can't see this button
					cy.get('main.ant-layout-content').then(($body) => {
						if ($body.find(`#${FORM.SALON}-request-publication`).length) {
							cy.clickButton('request-publication', FORM.SALON)
							cy.wait('@getSalonDetail').then((interceptionGetSalonDetail: any) => {
								expect(interceptionGetSalonDetail.response.statusCode).to.equal(200)
								// NOTE: all neccesary requirements for publication should be fulfilled
								cy.clickButton('request-publication-modal', FORM.SALON)
								cy.wait('@requestSalonPublication').then((interceptionRequestSalonPublication: any) => {
									expect(interceptionRequestSalonPublication.response.statusCode).to.equal(200)
									// check conf toast message
									cy.checkSuccessToastMessage()
								})
							})
						}
					})
				}
			})

			it('Confirm salon publication', () => {
				// get salonID from env
				const salonID = Cypress.env(SALON_ID)
				cy.intercept({
					method: 'GET',
					url: `/api/b2b/admin/salons/${salonID}`
				}).as('getSalonDetail')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/salons/${salonID}/resolve-publication`
				}).as('resolveSalonPublication')
				cy.visit(`/salons/${salonID}`)
				if ((actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) && !(role in SALON_ROLES)) {
					// NOTE: roles that don't have permissions can't see this button
					cy.get('main.ant-layout-content').then(($body) => {
						if ($body.find(`#${FORM.SALON}-accept-salon`).length) {
							cy.clickButton('accept-salon', FORM.SALON)
							cy.wait(['@getSalonDetail', '@resolveSalonPublication']).then(([interceptionGetSalonDetail, interceptionResolveSalonPublication]: any[]) => {
								expect(interceptionGetSalonDetail.response.statusCode).to.equal(200)
								expect(interceptionResolveSalonPublication.response.statusCode).to.equal(200)
								// published tag should be visible
								cy.get('.noti-tag.bg-status-published').should('be.visible')
								// check conf toast message
								cy.checkSuccessToastMessage()
							})
						}
					})
				}
			})

			it('Hide salon publication', () => {
				// get salonID from env
				const salonID = Cypress.env(SALON_ID)
				cy.intercept({
					method: 'GET',
					url: `/api/b2b/admin/salons/${salonID}`
				}).as('getSalonDetail')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/salons/${salonID}/unpublish`
				}).as('unpublishSalon')
				cy.visit(`/salons/${salonID}`)
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
					cy.wait(5000)
					// NOTE: roles that don't have permissions can't see this button
					cy.get('main.ant-layout-content').then(($body) => {
						if ($body.find(`#${FORM.SALON}-hide.salon`).length) {
							cy.clickButton('hide-salon', FORM.SALON)
							// wait for animations
							cy.wait(2000)
							cy.setInputValue(FORM.NOTE, 'note', salon.unpublish.reason)
							cy.clickButton(SUBMIT_BUTTON_ID, FORM.NOTE)
							cy.wait(['@getSalonDetail', '@unpublishSalon']).then(([interceptionGetSalonDetail, interceptionUnpublishSalon]: any[]) => {
								expect(interceptionGetSalonDetail.response.statusCode).to.equal(200)
								expect(interceptionUnpublishSalon.response.statusCode).to.equal(200)
								// not published tag should be visible
								cy.get('.noti-tag.bg-status-notPublished').should('be.visible')
								// alert message with hide reason should be visible
								cy.get('.ant-alert-message > p').should('include.text', salon.unpublish.reason)
								// check conf toast message
								cy.checkSuccessToastMessage()
							})
						}
					})
				}
			})

			it('Decline salon publication', () => {
				// get salonID from env
				const salonID = Cypress.env(SALON_ID)
				cy.intercept({
					method: 'GET',
					url: `/api/b2b/admin/salons/${salonID}`
				}).as('getSalonDetail')
				cy.intercept({
					method: 'PATCH',
					url: `/api/b2b/admin/salons/${salonID}/resolve-publication`
				}).as('resolveSalonPublication')
				cy.visit(`/salons/${salonID}`)
				if ((actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) && !(role in SALON_ROLES)) {
					// NOTE: roles that don't have permissions can't see this button
					cy.get('main.ant-layout-content').then(($body) => {
						if ($body.find(`#${FORM.SALON}-decline-salon`).length) {
							cy.clickButton('decline-salon', FORM.SALON)
							// wait for animations
							cy.wait(2000)
							cy.setInputValue(FORM.NOTE, 'note', salon.decline.reason)
							cy.clickButton(SUBMIT_BUTTON_ID, FORM.NOTE)
							cy.wait(['@getSalonDetail', '@resolveSalonPublication']).then(([interceptionGetSalonDetail, interceptionResolveSalonPublication]: any[]) => {
								expect(interceptionGetSalonDetail.response.statusCode).to.equal(200)
								expect(interceptionResolveSalonPublication.response.statusCode).to.equal(200)
								// declined tag should be visible
								cy.get('.noti-tag.bg-status-declined').should('be.visible')
								// alert message with decline reason should be visible
								cy.get('.ant-alert-message > p').should('include.text', salon.decline.reason)
								// check conf toast message
								cy.checkSuccessToastMessage()
							})
						}
					})
				}
			})
		})

		// history
		context('Salon history', () => {
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
						if ($body.find(`[data-node-key="${TAB_KEYS.SALON_HISTORY}"]`).length) {
							cy.clickTab(TAB_KEYS.SALON_HISTORY)
							cy.wait('@getSalonHistory').then((interceptionGetSalonHistory: any) => {
								expect(interceptionGetSalonHistory.response.statusCode).to.equal(200)
								if ($body.find('.noti-tag.bg-status-published').length) {
									// only published salon can see salon history
									cy.get('#salon-history-list').should('be.visible')
								} else {
									// empty state for unpublished salons
									cy.get('.ant-empty').should('be.visible')
								}
								// update range of history data
								cy.get(`#${FORM.SALON_HISTORY_FILTER}-dateFromTo`).find('input').first().click({ force: true })
								cy.get('.ant-picker-dropdown :not(.ant-picker-dropdown-hidden)', { timeout: 2000 })
									.should('be.visible')
									.find('.ant-picker-presets > ul > li')
									.first()
									.click()
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
						// if user has assigend more salons, then it redirects him to the first salon from the list, otherwise it redirects him to dashboard
						cy.location('pathname').should('include', `/salons`)
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
