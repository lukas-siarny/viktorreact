import { loginViaApi } from '../../support/e2e'

// enums
import { FORM, PERMISSION, SALON_ROLES } from '../../../src/utils/enums'
import { CRUD_OPERATIONS, SALON_ID } from '../../enums'

const salonApprovalProcessTestSuite = (actions: CRUD_OPERATIONS[], role: SALON_ROLES | PERMISSION, email?: string, password?: string): void => {
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

		/* it('Hide salon publication', () => {
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
		}) */

		/* it('Decline salon publication', () => {
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
		}) */
	})
}

export default salonApprovalProcessTestSuite
