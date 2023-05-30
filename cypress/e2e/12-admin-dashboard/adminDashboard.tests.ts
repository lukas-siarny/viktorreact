import dayjs from 'dayjs'

import { loginViaApi } from '../../support/e2e'

// enums
import { DASHBOARD_TAB_KEYS, PERMISSION, PUBLISHED_PREMIUM_SALONS_BAR_ID, SALON_ROLES, SALON_STATS_ANNUAL_ID, SALON_STATS_MONTHLY_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS, SALON_ID } from '../../enums'

const adminDashboardTestSuite = (actions: CRUD_OPERATIONS[], role: SALON_ROLES | PERMISSION, email?: string, password?: string): void => {
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

	it('Admin dashboard', () => {
		cy.visit('/')
		const salonID = Cypress.env(SALON_ID)
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
			if (!salonID && !(role in SALON_ROLES)) {
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/notino-dashboard/salon-development-time-stats'
				}).as('getSalonTimeStats')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/notino-dashboard/salon-reservations-time-stats'
				}).as('getReservationTimeStats')
				cy.intercept({
					method: 'GET',
					pathname: '/api/b2b/admin/notino-dashboard'
				}).as('getNotinoDashboard')
				cy.wait(['@getSalonTimeStats', '@getReservationTimeStats', '@getNotinoDashboard']).then(
					([interceptionSalonTimeStats, interceptionReservationTimeStats, interceptionNotinoDashboard]: any[]) => {
						expect(interceptionSalonTimeStats.response.statusCode).to.equal(200)
						expect(interceptionReservationTimeStats.response.statusCode).to.equal(200)
						expect(interceptionNotinoDashboard.response.statusCode).to.equal(200)
						const now = dayjs()

						cy.get(`#${SALON_STATS_MONTHLY_ID}`).scrollIntoView()
						const dateValueMonth = now.add(1, 'month').format('YYYY-MM')
						cy.setDateInputValue(undefined, SALON_STATS_MONTHLY_ID, dateValueMonth, now.month() === 11)
						cy.wait('@getSalonTimeStats').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

						cy.get(`#${SALON_STATS_ANNUAL_ID}`).scrollIntoView()
						const dateValueYear = now.add(1, 'year').format('YYYY')
						cy.setDateInputValue(undefined, SALON_STATS_ANNUAL_ID, dateValueYear, now.year() === 2030)
						cy.wait('@getSalonTimeStats').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

						cy.clickTab(DASHBOARD_TAB_KEYS.RESERVATION_SYSTEM)
						cy.get(`#${PUBLISHED_PREMIUM_SALONS_BAR_ID}`).should('be.visible')
					}
				)
			}
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})
}

export default adminDashboardTestSuite
