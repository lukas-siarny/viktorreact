import './commands'

declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Command to login into app via api endpoint
			 * @example cy.apiAuth('test@test.com', 't123')
			 */
			apiAuth(email: string, password: string): Chainable<Element>
		}
	}
}
