// import { generateRandomString } from '../../support/helpers'
import { FORM } from '../../../src/utils/enums'

import user from '../../fixtures/user.json'

context('User', () => {
	// id of created user
	let userID = 0
	beforeEach(() => {
		// restore local storage with tokens from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	it('Update my account info', () => {
		cy.visit('/my-account')
		cy.setInputValue(FORM.USER_ACCOUNT, 'firstName', user.firstName, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'lastName', user.lastName, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'phone', user.phone, true)
		cy.get('form').submit()
		cy.checkSuccessToastMessage()
	})

	it('Create partner as ADMIN', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/users'
		}).as('createPartner')
		cy.visit('/users/create')
		cy.setInputValue(FORM.ADMIN_CREATE_USER, 'email', user.emailSuffix)
		cy.setInputValue(FORM.ADMIN_CREATE_USER, 'phone', user.phone)
		cy.selectOptionDropdown(FORM.ADMIN_CREATE_USER, 'roleID', 'Partner')
		cy.get('form').submit()
		cy.wait('@createPartner').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			userID = interception.response.body.user.id
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Update partner info as ADMIN', () => {
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/users/${userID}`
		}).as('updateUser')
		cy.visit(`/users/${userID}`)
		cy.setInputValue(FORM.USER_ACCOUNT, 'firstName', user.firstName)
		cy.setInputValue(FORM.USER_ACCOUNT, 'lastName', user.lastName)
		cy.get('form').submit()
		cy.wait('@updateUser').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
		})
	})

	it('Delete partner as ADMIN', () => {
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/users/${userID}`
		}).as('deleteUser')
		cy.visit(`/users/${userID}`)
		cy.clickDeleteButtonWithConf(FORM.USER_ACCOUNT)
		cy.wait('@deleteUser').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			// check conf toast message
			cy.checkSuccessToastMessage()
			cy.location('pathname').should('eq', `/users`)
		})
	})
})
