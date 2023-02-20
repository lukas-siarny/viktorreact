import { CALENDAR_EVENT_TYPE, CREATE_BUTTON_ID, FORM, RESERVATION_SOURCE_TYPE, RESERVATION_STATE } from '../../../src/utils/enums'

// fixtures
import languages from '../../fixtures/languages.json'
import { EVENTS } from '../../../src/reducers/calendar/calendarTypes'
import supportContact from '../../fixtures/support.json'

describe('Reservations settings', () => {
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})
	const salonID = '00000000-0000-0000-0000-000000000009'
	// Update
	// it('update reservations settings', () => {
	// 	cy.intercept({
	// 		method: 'PATCH',
	// 		url: `/api/b2b/admin/salons/${salonID}/settings`
	// 	}).as('updateReservationsSettings')
	// 	cy.visit(`/salons/${salonID}/reservations-settings`)
	// 	cy.setInputValue(FORM.RESEVATION_SYSTEM_SETTINGS, 'maxDaysB2cCreateReservation', '3', false, true)
	// 	cy.setInputValue(FORM.RESEVATION_SYSTEM_SETTINGS, 'maxHoursB2cCreateReservationBeforeStart', '3', false, true)
	// 	cy.setInputValue(FORM.RESEVATION_SYSTEM_SETTINGS, 'maxHoursB2cCancelReservationBeforeStart', '2', false, true)
	// 	cy.selectOptionDropdown(FORM.RESEVATION_SYSTEM_SETTINGS, 'minutesIntervalB2CReservations', '20')
	// 	// cy.selectOptionDropdown(FORM.RESERVATIONS_FILTER, 'reservationCreateSourceType', 'B2B')
	//
	// 	cy.wait('@updateReservationsSettings').then((interception: any) => {
	// 		// check status code
	// 		expect(interception.response.statusCode).to.equal(200)
	// 		// cy.location('pathname').should('eq', '/languages-in-salons')
	// 	})
	// })
	// Deactive
	it('deactive reservations settings', () => {
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/salons/${salonID}/settings`
		}).as('deactiveReservationsSystem')
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/salons/${salonID}`
		}).as('getSalon')
		cy.visit(`/salons/${salonID}/reservations-settings`)
		cy.wait('@getSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// cy.location('pathname').should('eq', '/languages-in-salons')
			cy.wait(2000) // Pocka kym sa initne formular lebo preskoci false na true pri switchi (zlozitejsi shape dlhsie sa inituje)
			cy.clickButton('enabledReservations', FORM.RESEVATION_SYSTEM_SETTINGS, true)
			cy.get(`#${FORM.RESEVATION_SYSTEM_SETTINGS}-form`).submit()
			cy.wait('@deactiveReservationsSystem').then((interception2: any) => {
				// check status code
				expect(interception2.response.statusCode).to.equal(200)
				// cy.location('pathname').should('eq', '/languages-in-salons')
			})
		})
	})
})
