import { CALENDAR_EVENT_TYPE, CREATE_BUTTON_ID, FORM, RESERVATION_SOURCE_TYPE, RESERVATION_STATE } from '../../../src/utils/enums'

// fixtures
import languages from '../../fixtures/languages.json'
import { EVENTS } from '../../../src/reducers/calendar/calendarTypes'
import supportContact from '../../fixtures/support.json'

describe('Reservations', () => {
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})
	const salonID = '00000000-0000-0000-0000-000000000009'
	// FILTER
	it('Filter reservations', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/salons/${salonID}/calendar-events/paginated`,
			query: {
				dateFrom: '2023-02-18',
				limit: '25',
				page: '1',
				order: 'startDate:ASC',
				eventTypes: `[${CALENDAR_EVENT_TYPE.RESERVATION}]`
			}
		}).as('filterReservations')
		cy.visit(`/salons/${salonID}/reservations`)
		cy.selectOptionDropdown(FORM.RESERVATIONS_FILTER, 'reservationStates', 'Confirmed')
		cy.selectOptionDropdown(FORM.RESERVATIONS_FILTER, 'reservationCreateSourceType', 'B2B')

		cy.wait('@filterReservations').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			cy.location('pathname').should('eq', `/salons/${salonID}/reservations`)
		})
	})
})
