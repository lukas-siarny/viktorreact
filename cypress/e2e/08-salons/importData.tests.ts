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
			method: 'POST',
			pathname: `/api/b2b/admin/imports/salons/${salonID}/customers`
		}).as('importCustomers')
		cy.visit(`/salons/${salonID}/customers`)
		if (actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.wait('@getCustomers').then((interceptionGetSalons: any) => {
				// check status code
				expect(interceptionGetSalons.response.statusCode).to.equal(200)
				cy.clickButton(IMPORT_BUTTON_ID(), FORM.CUSTOMERS_FILTER)
				if (actions.includes(CRUD_OPERATIONS.CREATE)) {
					// wait for animation
					cy.wait(2000)
					cy.selectOptionDropdownCustom(undefined, 'noti-customer-template-select', undefined, true)
					cy.get(`#${DOWNLOAD_BUTTON_ID}`).click()
					cy.uploadFile('file', '../files/import_of_clients_template.xlsx', FORM.IMPORT_FORM)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.IMPORT_FORM)
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
		cy.visit(`/salons/${salonID}/reservations-settings`)
		if (actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.wait('@getSalon').then((interceptionGetSalon: any) => {
				expect(interceptionGetSalon.response.statusCode).to.equal(200)

				cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-${IMPORT_BUTTON_ID('customers')}`).scrollIntoView()
				cy.clickButton(IMPORT_BUTTON_ID('customers'), FORM.RESEVATION_SYSTEM_SETTINGS)

				if (actions.includes(CRUD_OPERATIONS.CREATE)) {
					// wait for animation
					cy.wait(2000)
					cy.selectOptionDropdownCustom(undefined, 'noti-template-select', undefined, true)
					cy.get(`#${DOWNLOAD_BUTTON_ID}`).click()
					cy.uploadFile('file', '../files/import_of_clients_template.xlsx', FORM.IMPORT_FORM)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.IMPORT_FORM)
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
		cy.visit(`/salons/${salonID}/reservations-settings`)
		if (actions.includes(CRUD_OPERATIONS.CREATE) || actions.includes(CRUD_OPERATIONS.READ)) {
			cy.wait('@getSalon').then((interceptionGetSalon: any) => {
				expect(interceptionGetSalon.response.statusCode).to.equal(200)

				// wait for animations
				cy.wait(2000)
				cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-enabledReservations > button`).then(($element) => {
					if (!$element.hasClass('ant-switch-checked')) {
						cy.wrap($element).click()
					}
				})

				cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-${IMPORT_BUTTON_ID('reservations')}`).scrollIntoView()
				cy.clickButton(IMPORT_BUTTON_ID('reservations'), FORM.RESEVATION_SYSTEM_SETTINGS)

				if (actions.includes(CRUD_OPERATIONS.CREATE)) {
					// wait for animation
					cy.wait(2000)
					cy.selectOptionDropdownCustom(undefined, 'noti-template-select', undefined, true)
					cy.get(`#${DOWNLOAD_BUTTON_ID}`).click()
					cy.uploadFile('file', '../files/import_of_reservations_template.xlsx', FORM.IMPORT_FORM)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.IMPORT_FORM)
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
}

export default importDataTestSuite
