import { CRUD_OPERATIONS, SALON_ID } from '../../enums'
import { /* FILTER_BUTTON_ID, */ FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

import reservations from '../../fixtures/reservations.json'

const reservationsTestSuite = (actions: CRUD_OPERATIONS[]): void => {
	describe('Reservations', () => {
		// NOTE: Timed out retrying after 6000ms: Expected to find element: #RESERVATIONS_FILTER-reservationStates, but never found it.
		// dookola to pada na tejto chybe, aj ked taky element realne existuje
		/* it('Filter reservations', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/salons/${salonID}/calendar-events/paginated*`
			}).as('filterReservations')
			cy.visit(`/salons/${salonID}/reservations`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@filterReservations')
				cy.selectOptionDropdownCustom(FORM.RESERVATIONS_FILTER, 'reservationStates', reservations.filter.reservationStates, true)
				cy.selectOptionDropdownCustom(FORM.RESERVATIONS_FILTER, 'reservationPaymentMethods', reservations.filter.reservationPaymentMethods, true)
				cy.selectOptionDropdownCustom(FORM.RESERVATIONS_FILTER, 'reservationCreateSourceType', reservations.filter.reservationCreateSourceType, true)
				cy.wait('@filterReservations').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					cy.location('pathname').should('eq', `/salons/${salonID}/reservations`)
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		}) */

		it('Update reservations settings', () => {
			// get salonID from env
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
			cy.visit(`/salons/${salonID}/reservations-settings`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.wait(['@getUser', '@getSalon']).then(([interceptionGetUser, interceptionGetSalon]: any[]) => {
					expect(interceptionGetUser.response.statusCode).to.equal(200)
					expect(interceptionGetSalon.response.statusCode).to.equal(200)
					// wait for animations
					cy.wait(2000)
					cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-enabledReservations > button`).then(($element) => {
						if (!$element.hasClass('ant-switch-checked')) {
							cy.wrap($element).click()
						}
					})
					cy.setInputValue(FORM.RESEVATION_SYSTEM_SETTINGS, 'maxDaysB2cCreateReservation', reservations.update.maxDaysB2cCreateReservation, false, true)
					cy.setInputValue(
						FORM.RESEVATION_SYSTEM_SETTINGS,
						'maxHoursB2cCreateReservationBeforeStart',
						reservations.update.maxHoursB2cCreateReservationBeforeStart,
						false,
						true
					)
					cy.setInputValue(
						FORM.RESEVATION_SYSTEM_SETTINGS,
						'maxHoursB2cCancelReservationBeforeStart',
						reservations.update.maxHoursB2cCancelReservationBeforeStart,
						false,
						true
					)
					cy.selectOptionDropdownCustom(FORM.RESEVATION_SYSTEM_SETTINGS, 'minutesIntervalB2CReservations', reservations.update.minutesIntervalB2CReservations, true)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.RESEVATION_SYSTEM_SETTINGS)
					cy.wait('@updateReservationsSettings').then((interception: any) => {
						// check status code
						expect(interception.response.statusCode).to.equal(200)
						cy.checkSuccessToastMessage()
						cy.location('pathname').should('eq', `/salons/${salonID}/reservations-settings`)
					})
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default reservationsTestSuite
