import { CRUD_OPERATIONS, SALON_ID } from '../../enums'
import { DOWNLOAD_BUTTON_ID, FORM, IMPORT_BUTTON_ID, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

const importDataTestSuite = (actions: CRUD_OPERATIONS[]) => {
	it('Import customers from customers page', () => {
		const salonID = Cypress.env(SALON_ID)
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/customers'
		}).as('getCustomers')
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/config/'
		}).as('getTemplates')
		cy.intercept({
			method: 'POST',
			pathname: `/api/b2b/admin/imports/salons/${salonID}/customers`
		}).as('importCustomers')
		cy.visit(`/salons/${salonID}/customers`)
		if (actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.wait('@getCustomers').then((interceptionGetSalons: any) => {
				// check status code
				expect(interceptionGetSalons.response.statusCode).to.equal(200)
				cy.clickButton(IMPORT_BUTTON_ID(), FORM.CUSTOMERS_FILTER)
				// wait for animation
				cy.wait(2000)

				cy.get('#noti-customer-template-select').click()
				cy.wait('@getTemplates').then((interceptorGetTempates: any) => {
					expect(interceptorGetTempates.response.statusCode).to.equal(200)
					// select first employee from the list
					cy.get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)', { timeout: 10000 })
						.should('be.visible')
						.find('.ant-select-item-option')
						.first()
						.click({ force: true })
					cy.get(`#${DOWNLOAD_BUTTON_ID}`).should('not.be.disabled')
				})

				cy.uploadFile('file', '../files/import_of_clients_template.xlsx', FORM.IMPORT_FORM)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.IMPORT_FORM)

				if (actions.includes(CRUD_OPERATIONS.CREATE)) {
					cy.wait('@importCustomers').then((interception: any) => {
						// check status code
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				} else {
					cy.checkForbiddenModal()
				}
			})
		} else {
			// check redirect to 403 not allowed page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Import customers from RS settings page', () => {
		const salonID = Cypress.env(SALON_ID)
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/salons/${salonID}/settings`
		}).as('updateReservationsSettings')
		cy.intercept({
			method: 'GET',
			pathname: `/api/b2b/admin/salons/${salonID}`
		}).as('getSalon')
		cy.intercept({
			method: 'GET',
			pathname: `/api/b2b/admin/users/*`
		}).as('getUser')
		cy.intercept({
			method: 'POST',
			pathname: `/api/b2b/admin/imports/salons/${salonID}/customers`
		}).as('importCustomers')
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/config/'
		}).as('getTemplates')
		cy.visit(`/salons/${salonID}/reservations-settings`)
		if (actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.wait(['@getUser', '@getSalon']).then(([interceptionGetUser, interceptionGetSalon]: any[]) => {
				expect(interceptionGetUser.response.statusCode).to.equal(200)
				expect(interceptionGetSalon.response.statusCode).to.equal(200)

				// wait for animations
				cy.wait(2000)
				cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-enabledReservations > button`).then(($element) => {
					if (!$element.hasClass('ant-switch-checked')) {
						cy.wrap($element).click()
					}

					cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-${IMPORT_BUTTON_ID('customers')}`).scrollIntoView()
					cy.clickButton(IMPORT_BUTTON_ID('customers'), FORM.RESEVATION_SYSTEM_SETTINGS)

					// wait for animation
					cy.wait(2000)

					cy.get('#noti-template-select').click()
					cy.wait('@getTemplates').then((interceptorGetTempates: any) => {
						expect(interceptorGetTempates.response.statusCode).to.equal(200)
						// select first employee from the list
						cy.get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)', { timeout: 10000 })
							.should('be.visible')
							.find('.ant-select-item-option')
							.first()
							.click({ force: true })
							cy.get(`#${DOWNLOAD_BUTTON_ID}`).should('not.be.disabled')
					})

					cy.uploadFile('file', '../files/import_of_clients_template.xlsx', FORM.IMPORT_FORM)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.IMPORT_FORM)

					if (actions.includes(CRUD_OPERATIONS.CREATE)) {
						cy.wait('@importCustomers').then((interception: any) => {
							// check status code
							expect(interception.response.statusCode).to.equal(200)
							// check conf toast message
							cy.checkSuccessToastMessage()
						})
					} else {
						cy.checkForbiddenModal()
					}
				})
			})
		} else {
			// check redirect to 403 not allowed page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Import reservations from RS settings page', () => {
		const salonID = Cypress.env(SALON_ID)
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/salons/${salonID}/settings`
		}).as('updateReservationsSettings')
		cy.intercept({
			method: 'GET',
			pathname: `/api/b2b/admin/salons/${salonID}`
		}).as('getSalon')
		cy.intercept({
			method: 'GET',
			pathname: `/api/b2b/admin/users/*`
		}).as('getUser')
		cy.intercept({
			method: 'POST',
			pathname: `/api/b2b/admin/imports/salons/${salonID}/calendar-events`
		}).as('importReservations')
		cy.intercept({
			method: 'GET',
			pathname: '/api/b2b/admin/config/'
		}).as('getTemplates')
		cy.visit(`/salons/${salonID}/reservations-settings`)
		if (actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.wait(['@getUser', '@getSalon']).then(([interceptionGetUser, interceptionGetSalon]: any[]) => {
				expect(interceptionGetUser.response.statusCode).to.equal(200)
				expect(interceptionGetSalon.response.statusCode).to.equal(200)

				// wait for animations
				cy.wait(2000)

				// wait for animations
				cy.wait(2000)
				cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-enabledReservations > button`).then(($element) => {
					if (!$element.hasClass('ant-switch-checked')) {
						cy.wrap($element).click()
					}

					cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-${IMPORT_BUTTON_ID('reservations')}`).scrollIntoView()
					cy.clickButton(IMPORT_BUTTON_ID('reservations'), FORM.RESEVATION_SYSTEM_SETTINGS)

					// wait for animation
					cy.wait(2000)

					cy.get('#noti-template-select').click()
					cy.wait('@getTemplates').then((interceptorGetTempates: any) => {
						expect(interceptorGetTempates.response.statusCode).to.equal(200)
						// select first employee from the list
						cy.get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)', { timeout: 10000 })
							.should('be.visible')
							.find('.ant-select-item-option')
							.first()
							.click({ force: true })
						cy.get(`#${DOWNLOAD_BUTTON_ID}`).should('not.be.disabled')
					})

					cy.uploadFile('file', '../files/import_of_reservations_template.xlsx', FORM.IMPORT_FORM)

					if (actions.includes(CRUD_OPERATIONS.CREATE)) {
						cy.clickButton(SUBMIT_BUTTON_ID, FORM.IMPORT_FORM)
						cy.wait('@importReservations').then((interception: any) => {
							// check status code
							expect(interception.response.statusCode).to.equal(200)
							// check conf toast message
							cy.checkSuccessToastMessage()
						})
					} else {
						cy.checkForbiddenModal()
					}
				})
			})
		} else {
			// check redirect to 403 not allowed page
			cy.location('pathname').should('eq', '/403')
		}
	})
}

export default importDataTestSuite
