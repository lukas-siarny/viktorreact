import Cypress from 'cypress'

// utils
import { FORM } from '../../../src/utils/enums'

const credentials = require('../../fixtures/adminCredentials.json')

context('Login', () => {
	it('Login into app as ADMIN user', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/login',
		}).as('authLogin')
		cy.visit('/login')
		cy.get(`#${FORM.LOGIN}-email`)
			.type(credentials.email).should('have.value', credentials.email)
		cy.get(`#${FORM.LOGIN}-password`)
			.type(credentials.password).should('have.value', credentials.password)
		cy.get('form').submit()
		cy.wait('@authLogin').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
		})
		cy.location('pathname').should('eq', '/')
	})
})
