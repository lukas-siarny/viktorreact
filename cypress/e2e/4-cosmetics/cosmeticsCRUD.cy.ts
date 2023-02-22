import { CREATE_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

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

	it('Create cosmetics', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/enums/cosmetics/'
		}).as('createCosmetics')
		cy.visit('/cosmetics')
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
	})

	it('Update cosmetics', () => {
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
		cy.visit('/cosmetics')
		cy.setInputValue(FORM.COSMETICS_FILTER, 'search', cosmetics.create.name)
		cy.wait('@getCosmetics').then((getInterception: any) => {
			// check status code
			expect(getInterception.response.statusCode).to.equal(200)
			cy.get(`[data-row-key="${cosmeticsID}"]`).click()
			cy.setInputValue(FORM.COSMETIC, 'name', cosmetics.update.name, false, true)
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.COSMETIC)
			cy.wait('@updateCosmetics').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	it('Delete cosmetics', () => {
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
		cy.visit('/cosmetics')
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
	})
})
