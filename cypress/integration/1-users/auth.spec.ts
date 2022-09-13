// utils
import { FORM } from '../../../src/utils/enums'
import { generateRandomString } from '../../support/helpers'

import user from '../../fixtures/user.json'

context('Auth', () => {
	/* it('Sign up', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/users/registration'
		}).as('registration')
		cy.visit('/signup')
		cy.setInputValue(FORM.REGISTRATION, 'email', `${generateRandomString(5)}_${user.emailSuffix}`)
		cy.setInputValue(FORM.REGISTRATION, 'password', user.password)
		cy.setInputValue(FORM.REGISTRATION, 'confirmPassword', user.password)
		cy.setInputValue(FORM.REGISTRATION, 'phone', user.phone)
		cy.clickButton('gdpr', FORM.REGISTRATION, true)
		cy.clickButton('gtc', FORM.REGISTRATION, true)
		cy.get('form').submit()
		cy.wait('@registration').then((interception: any) => {
			// check status code of registration request
			expect(interception.response.statusCode).to.equal(200)
			// take local storage snapshot
			cy.saveLocalStorage()
		})
		// check redirect to activation page
		cy.location('pathname').should('eq', '/activation')
	}) */

	it('Sign out', () => {
		cy.restoreLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/logout'
		}).as('authLogout')
		cy.visit('/')
		cy.get('.noti-my-account').click()
		cy.get('#logOut').click()
		cy.wait('@authLogout').then((interception: any) => {
			// check status code of logout request
			expect(interception.response.statusCode).to.equal(200)
			// check if tokens are erased
			assert.isNull(localStorage.getItem('refresh_token'))
			assert.isNull(localStorage.getItem('access_token'))
		})
		// check redirect to login page
		cy.location('pathname').should('eq', '/login')
	})

	it('Sign in', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/login'
		}).as('authLogin')
		cy.visit('/login')
		cy.setInputValue(FORM.LOGIN, 'email', Cypress.env('auth_email'))
		cy.setInputValue(FORM.LOGIN, 'password', Cypress.env('auth_password'))
		cy.get('form').submit()
		cy.wait('@authLogin').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			// take local storage snapshot
			cy.saveLocalStorage()
		})
		// check redirect to home page
		cy.location('pathname').should('eq', '/')
	})
})
