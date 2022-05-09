import './commands'

const credentials = require('../fixtures/credentials.json')

describe('Hooks', () => {
	it ('loginViaApi', () => {
		// TODO - load credentials from process env Cypress.env('auth_email') Cypress.env('auth_password')
		cy.apiAuth(credentials.email, credentials.password)
	})
})

// TODO - workaround for uncaught exception https://github.com/quasarframework/quasar/issues/2233
const resizeObserverLoopErrRe: string = 'ResizeObserver loop limit exceeded'

Cypress.on('uncaught:exception', (err: any) => {
	if (resizeObserverLoopErrRe.localeCompare(err.message)) {
		// returning false to prevent Cypress failing the test
		return false
	}
})
