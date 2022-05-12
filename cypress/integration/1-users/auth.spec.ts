// utils
import { FORM } from '../../../src/utils/enums'
import { generateRandomString } from '../../support/helpers'

import credentials from '../../fixtures/credentials.json'
import user from '../../fixtures/user.json'

context('Auth', () => {
	// TODO
	it('Sign up', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/users/registration'
		}).as('registration')
		cy.visit('/signup')
		cy.setInputValue(FORM.REGISTRATION, 'email', `${generateRandomString(5)}${user.email}`)
		cy.setInputValue(FORM.REGISTRATION, 'password', user.password)
		cy.setInputValue(FORM.REGISTRATION, 'confirmPassword', user.password)
		cy.setInputValue(FORM.REGISTRATION, 'phone', user.phone)
		cy.clickButton('gdpr', FORM.REGISTRATION, true)
		cy.clickButton('gtc', FORM.REGISTRATION, true)
		cy.get('form').submit()
		cy.wait('@registration').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			// take local storage snapshot
			cy.saveLocalStorage()
		})
		// check redirect to activation page
		cy.location('pathname').should('eq', '/activation')
	})

	it('Sign out', () => {
		cy.restoreLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/logout'
		}).as('authLogout')
		cy.visit('/')
		cy.clickButton('logout-btn')
		cy.wait('@authLogout').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			assert.isNull(localStorage.getItem('refresh_token'))
			assert.isNull(localStorage.getItem('access_token'))
		})
		// check redirect to home page
		cy.location('pathname').should('eq', '/login')
	})

	it('Sign in', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/login'
		}).as('authLogin')
		cy.visit('/login')
		// TODO - load credentials from process env Cypress.env('auth_email') Cypress.env('auth_password')
		cy.setInputValue(FORM.LOGIN, 'email', credentials.email)
		cy.setInputValue(FORM.LOGIN, 'password', credentials.password)
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
