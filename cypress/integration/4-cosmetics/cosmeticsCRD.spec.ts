import { CREATE_BUTTON_ID, FORM } from '../../../src/utils/enums'

// fixtures
import cosmetics from '../../fixtures/cosmetics.json'

describe('Cosmetics', () => {
	let cosmeticsID: any
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	/* it('Create cosmetics', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/cosmetics/'
		}).as('createCosmetics')
		cy.visit('/cosmetics')
		cy.clickButton(FORM.COSMETIC, CREATE_BUTTON_ID)
		cy.setInputValue(FORM.COSMETIC, 'name', cosmetics.name)
		cy.get(`#${FORM.COSMETIC}-form`).submit()
		cy.wait('@createCosmetics').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			cosmeticsID = interception.response.body.cosmetic.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Delete cosmetics', () => {
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/enums/cosmetics/${cosmeticsID}`
		}).as('deleteCosmetics')
		cy.visit('/cosmetics')
		cy.setInputValue(FORM.COSMETICS_FILTER, 'search', cosmetics.name)
		cy.get('.ant-table-row > :nth-child(1)').click()
		cy.clickDeleteButtonWithConf(FORM.COSMETIC)
		cy.wait('@deleteCosmetics').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
			cy.location('pathname').should('eq', '/cosmetics')
		})
	}) */
})
