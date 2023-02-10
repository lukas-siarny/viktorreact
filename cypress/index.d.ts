declare namespace Cypress {
	interface Chainable {
		/**
		 * Command to set value into pin filed
		 * @example cy.setValuesForPinField('FORM.test', 'test', '12345')
		 */
		setValuesForPinField(form: string, key: string, value: string): Chainable<Element>
	}
}
