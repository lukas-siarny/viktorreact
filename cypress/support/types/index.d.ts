import './commands'

declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Command to login into app
			 * @example cy.login('test@test.com', 't123')
			 */
			login(email: string, password: string): Chainable<Element>
		}
	}
}
