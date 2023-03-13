import { CRUD_OPERATIONS, SALON_ID } from '../../enums'
import { FORM } from '../../../src/utils/enums'

import reservations from '../../fixtures/reservations.json'

const reservationsTestSuite = (actions: CRUD_OPERATIONS[]): void => {
	describe('Reservations', () => {
		it('Filter reservations', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/salons/${salonID}/calendar-events/paginated`
			}).as('filterReservations')
			cy.visit(`/salons/${salonID}/reservations`)
			cy.wait('@filterReservations')
			cy.selectOptionDropdown(FORM.RESERVATIONS_FILTER, 'reservationStates', reservations.filter.reservationStates)
			cy.selectOptionDropdown(FORM.RESERVATIONS_FILTER, 'reservationPaymentMethods', reservations.filter.reservationPaymentMethods)
			cy.selectOptionDropdown(FORM.RESERVATIONS_FILTER, 'reservationCreateSourceType', reservations.filter.reservationCreateSourceType)
			cy.wait('@filterReservations').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				cy.location('pathname').should('eq', `/salons/${salonID}/reservations`)
			})
		})

		it('update reservations settings', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${salonID}/settings`
			}).as('updateReservationsSettings')
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/salons/${salonID}`
			}).as('getSalon')
			cy.visit(`/salons/${salonID}/reservations-settings`)
			cy.wait('@getSalon')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
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
				cy.selectOptionDropdown(FORM.RESEVATION_SYSTEM_SETTINGS, 'minutesIntervalB2CReservations', reservations.update.minutesIntervalB2CReservations)

				cy.wait('@updateReservationsSettings').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					cy.checkSuccessToastMessage()
					cy.location('pathname').should('eq', `/salons/${salonID}/reservations-settings`)
				})
			}
		})
	})
}

export default reservationsTestSuite
