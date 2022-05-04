import 'cypress-localstorage-commands'
import { FORM } from '../../src/utils/enums'

Cypress.Commands.add('login', (email: string, password: string) => {
	cy.log(`Logging with ${email} email`)
	cy.intercept({
		method: 'POST',
		url: '/api/b2b/admin/auth/login',
	}).as('authLogin')
	cy.visit('/login')
	cy.get(`#${FORM.LOGIN}-email`)
		.type(email).should('have.value', email)
	cy.get(`#${FORM.LOGIN}-password`)
		.type(password).should('have.value', password)
	cy.get('form').submit()
	cy.wait('@authLogin').then((interception: any) => {
		// check status code of login request
		expect(interception.response.statusCode).to.equal(200)
	})
	cy.location('pathname').should('eq', '/')
})
