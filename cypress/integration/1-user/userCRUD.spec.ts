import { FORM } from '../../../src/utils/enums'

const user = require('../../fixtures/user.json')

context('User', () => {
	beforeEach(() => {
		// restore local storage with tokens from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	it('Update my account info', () => {
		cy.intercept({
			method: 'PATCH',
			url: '/api/b2b/admin/users/3',
		}).as('updateInfo')
		cy.visit('/my-account')
		cy.setInputValue(FORM.USER_ACCOUNT, 'firstName',  user.firstName, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'lastName',  user.lastName, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'phone',  user.phone, true)
		cy.get('form').submit()
		cy.wait('@updateInfo').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			// take local storage snapshot
			cy.saveLocalStorage()
		})
	})

	it('Update partner info as ADMIN', () => {
		cy.intercept({
			method: 'PATCH',
			url: '/api/b2b/admin/users/3',
		}).as('updateInfo')
		cy.visit('/my-account')
		cy.setInputValue(FORM.USER_ACCOUNT, 'firstName',  user.firstName, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'lastName',  user.lastName, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'phone',  user.phone, true)
		cy.get('form').submit()
		cy.wait('@updateInfo').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			// take local storage snapshot
			cy.saveLocalStorage()
		})
	})
})
