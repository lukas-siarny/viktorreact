import { FORM } from '../../../src/utils/enums'

const user = require('../../fixtures/user.json')

context('Registration', () => {
	it('Sign up as user', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/login',
		}).as('registration')
		cy.visit('/signup')
		// REGISTRATION-email
		cy.get(`#${FORM.REGISTRATION}-email`)
			.type(user.email).should('have.value', user.email)
	})
})
