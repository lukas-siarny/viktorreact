import './commands'

describe('Hooks', () => {
	it('loginViaApi', () => {
		cy.log(`sign_in_url is ${Cypress.env('sign_in_url')}`)
		cy.log(`auth_email is ${Cypress.env('auth_email')}`)
		cy.log(`auth_password is ${Cypress.env('auth_password')}`)
		cy.apiAuth(Cypress.env('auth_email'), Cypress.env('auth_password'), Cypress.env('sign_in_url'))
	})
})

// TODO - workaround for uncaught exception https://github.com/quasarframework/quasar/issues/2233
const resizeObserverLoopErrRe = 'ResizeObserver loop limit exceeded'

Cypress.on('uncaught:exception', (err: any) => {
	if (resizeObserverLoopErrRe.localeCompare(err.message)) {
		// returning false to prevent Cypress failing the test
		return false
	}
	return true
})
