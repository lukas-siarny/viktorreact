import Cypress from 'cypress'

// utils
import { FORM } from '../../../src/utils/enums'

const credentials = require('../../fixtures/credentials.json')
const user = require('../../fixtures/user.json')

context('Auth', () => {
	it('Sign up', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/login',
		}).as('registration')
		cy.visit('/signup')
		cy.setInputValue(FORM.REGISTRATION, 'email',  user.email)
		cy.setInputValue(FORM.REGISTRATION, 'password',  user.password)
		cy.setInputValue(FORM.REGISTRATION, 'confirmPassword',  user.password)
		cy.setInputValue(FORM.REGISTRATION, 'phone',  user.phone)
		cy.clickButton(FORM.REGISTRATION, 'gdpr', true)
		cy.clickButton(FORM.REGISTRATION, 'gtc', true)
	})

	it('Sign in', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/login',
		}).as('authLogin')
		cy.visit('/login')
		// TODO - load credentials from process env Cypress.env('auth_email') Cypress.env('auth_password')
		cy.setInputValue(FORM.LOGIN, 'email',  credentials.email)
		cy.setInputValue(FORM.LOGIN, 'password',  credentials.password)
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
