// import { generateRandomString } from '../../support/helpers'
import { FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

import user from '../../fixtures/user.json'
import { generateRandomString } from '../../support/helpers'

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
		cy.setInputValue(FORM.USER_ACCOUNT, 'firstName', user.updateMyAccount.firstName, false, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'lastName', user.updateMyAccount.lastName, false, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'phone', user.updateMyAccount.phone, false, true)
		cy.get('form').submit()
		cy.checkSuccessToastMessage()
	})

	it('Create partner as ADMIN', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/users'
		}).as('createPartner')
		cy.visit('/users/create')
		cy.setInputValue(FORM.ADMIN_CREATE_USER, 'email', `${generateRandomString(6)}_${user.create.emailSuffix}`)
		cy.setInputValue(FORM.ADMIN_CREATE_USER, 'phone', user.create.phone)
		cy.selectOptionDropdown(FORM.ADMIN_CREATE_USER, 'roleID', 'Partner')
		cy.clickButton(SUBMIT_BUTTON_ID, FORM.ADMIN_CREATE_USER)
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
			method: 'GET',
			url: `/api/b2b/admin/users/${userID}`
		}).as('getUser')
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/users/${userID}`
		}).as('updateUser')
		cy.visit(`/users/${userID}`)
		cy.wait('@getUser').then((interceptorGetUser: any) => {
			// check status code of login request
			expect(interceptorGetUser.response.statusCode).to.equal(200)

			cy.setInputValue(FORM.USER_ACCOUNT, 'firstName', user.update.firstName, false, true)
			cy.setInputValue(FORM.USER_ACCOUNT, 'lastName', user.update.lastName, false, true)
			cy.setInputValue(FORM.USER_ACCOUNT, 'phone', user.update.phone, false, true)
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.USER_ACCOUNT)
			cy.wait('@updateUser').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		})
	})

	it('Delete partner as ADMIN', () => {
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/users/${userID}`
		}).as('getUser')
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/users/${userID}`
		}).as('deleteUser')
		cy.visit(`/users/${userID}`)
		cy.wait('@getUser').then((interceptorGetUser: any) => {
			// check status code of login request
			expect(interceptorGetUser.response.statusCode).to.equal(200)
			cy.clickDeleteButtonWithConfCustom(FORM.USER_ACCOUNT)
			cy.wait('@deleteUser').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
				cy.location('pathname').should('eq', `/users`)
			})
		})
	})
})
