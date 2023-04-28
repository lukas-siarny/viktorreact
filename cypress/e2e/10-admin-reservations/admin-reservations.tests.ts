import { FILTER_BUTTON_ID, FORM } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'
import reservations from '../../fixtures/reservations.json'

import { loginViaApi } from '../../support/e2e'

const adminReservationsTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
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

	describe('Admin reservations', () => {
		it('Filter reservations', () => {
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/calendar-events/reservations*`
			}).as('filterReservations')
			cy.visit(`/reservations`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@filterReservations')
				cy.clickButton(FILTER_BUTTON_ID, FORM.NOTINO_RESERVATIONS_FILTER)
				// wait for animation
				cy.wait(1000)
				cy.selectOptionDropdownCustom(FORM.NOTINO_RESERVATIONS_FILTER, 'reservationStates', reservations.filter.reservationStates, true)
				cy.selectOptionDropdownCustom(FORM.NOTINO_RESERVATIONS_FILTER, 'reservationPaymentMethods', reservations.filter.reservationPaymentMethods, true)
				cy.selectOptionDropdownCustom(FORM.NOTINO_RESERVATIONS_FILTER, 'reservationCreateSourceType', reservations.filter.reservationCreateSourceType, true)
				cy.wait('@filterReservations').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					cy.location('pathname').should('eq', `/reservations`)
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default adminReservationsTestSuite
