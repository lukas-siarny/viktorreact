import Cypress from 'cypress'

// utils
import { FORM } from '../../../src/utils/enums'

const credentials = require('../../fixtures/credentials.json')

context('Login', () => {
	it('Login into app as ADMIN user', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/login',
		}).as('authLogin')
		cy.visit('/login')
		// TODO - load credentials from process env Cypress.env('auth_email') Cypress.env('auth_password')
		cy.get(`#${FORM.LOGIN}-email`)
			.type(credentials.email).should('have.value', credentials.email)
		cy.get(`#${FORM.LOGIN}-password`)
			.type(credentials.password).should('have.value', credentials.password)
		cy.get('form').submit()
		cy.wait('@authLogin').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			// take local storage snapshot
			cy.saveLocalStorage()
		})
		cy.location('pathname').should('eq', '/')
	})
})
