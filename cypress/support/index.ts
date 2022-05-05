import './commands'

const credentials = require('../fixtures/adminCredentials.json')

describe('Hooks', () => {
	it ('loginViaApi', () => {
		// TODO - load credentials from process env Cypress.env('auth_email') Cypress.env('auth_password')
		cy.apiAuth(credentials.email, credentials.password)
	})
})
