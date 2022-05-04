// utils
import { FORM } from '../../../src/utils/enums'

const salon = require('../../fixtures/salon.json')
const credentials = require('../../fixtures/adminCredentials.json')

context('Salon', () => {
	beforeEach(() => {
		cy.login(credentials.email, credentials.password)
	})

	it('Create salon as ADMIN user', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/salons',
		}).as('createSalon')
		cy.visit('/salons/create')
		cy.get(`#${FORM.SALON}-name`)
			.type(salon.name).should('have.value', salon.name)
		cy.get('form').submit()
		cy.wait('@createSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
		})
		// cy.location('pathname').should('eq', '/api/b2b/admin/salons')
	})
})
