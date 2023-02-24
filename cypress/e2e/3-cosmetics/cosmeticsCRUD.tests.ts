import { loginViaApi } from '../../support/e2e'

import cosmetics from '../../fixtures/cosmetics.json'

// enums
import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const cosmeticsCRUDTestSuit = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	let cosmeticsID: any

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

	it('Create cosmetics', () => {
		cy.visit('/cosmetics')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/enums/cosmetics/'
			}).as('createCosmetics')
			cy.clickButton(FORM.COSMETIC, CREATE_BUTTON_ID)
			cy.setInputValue(FORM.COSMETIC, 'name', cosmetics.create.name)
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.COSMETIC)
			cy.wait('@createCosmetics').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				cosmeticsID = interception.response.body.cosmetic.id
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Update cosmetics', () => {
		cy.visit('/cosmetics')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/enums/cosmetics/${cosmeticsID}`
			}).as('updateCosmetics')
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/enums/cosmetics`,
				query: {
					limit: '25',
					page: '1',
					search: cosmetics.create.name
				}
			}).as('getCosmetics')
			cy.setInputValue(FORM.COSMETICS_FILTER, 'search', cosmetics.create.name)
			cy.wait('@getCosmetics').then((getInterception: any) => {
				// check status code
				expect(getInterception.response.statusCode).to.equal(200)
				cy.get(`[data-row-key="${ cosmeticsID }"]`).click()
				cy.setInputValue(FORM.COSMETIC, 'name', cosmetics.update.name, false, true)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.COSMETIC)
				cy.wait('@updateCosmetics').then((interception: any) => {
					// check status code of login request
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Delete cosmetics', () => {
		cy.visit('/cosmetics')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/enums/cosmetics/${cosmeticsID}`
			}).as('deleteCosmetics')
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/enums/cosmetics`,
				query: {
					limit: '25',
					page: '1',
					search: cosmetics.update.name
				}
			}).as('getCosmetics')
			cy.setInputValue(FORM.COSMETICS_FILTER, 'search', cosmetics.update.name, false, true)
			cy.wait('@getCosmetics').then((getInterception: any) => {
				// check status code
				expect(getInterception.response.statusCode).to.equal(200)
				cy.get('.ant-table-row > :nth-child(1)').click()
				cy.clickDeleteButtonWithConfCustom(FORM.COSMETIC)
				cy.wait('@deleteCosmetics').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
					cy.location('pathname').should('eq', '/cosmetics')
				})
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})
}

export default cosmeticsCRUDTestSuit
