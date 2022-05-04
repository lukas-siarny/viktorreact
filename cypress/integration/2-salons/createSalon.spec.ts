// utils
import { FORM } from '../../../src/utils/enums'

const salon = require('../../fixtures/salon.json')

context('Salon', () => {
	beforeEach(() => {
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		cy.saveLocalStorage()
	})

	it('Create salon as ADMIN user', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/salons',
		}).as('createSalon')
		cy.visit('/salons/create')
		cy.get(`#${FORM.SALON}-name`)
			.type(salon.name).should('have.value', salon.name)
		cy.get(`#${FORM.SALON}-phone`)
			.type(salon.phone).should('have.value', salon.phone)
		cy.get(`#${FORM.SALON}-email`)
			.type(salon.email).should('have.value', salon.email)
		cy.get(`#${FORM.SALON}-otherPaymentMethods`)
			.type(salon.paymentMethods).should('have.value', salon.paymentMethods)
		// cy.get('form').submit()
		/* cy.wait('@createSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
		}) */
		// cy.location('pathname').should('eq', '/api/b2b/admin/salons')
	})

	it('update salon as ADMIN user', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/salons',
		}).as('createSalon')
		cy.visit('/salons/create')
		cy.get(`#${FORM.SALON}-name`)
			.type(salon.name).should('have.value', salon.name)
		cy.get(`#${FORM.SALON}-phone`)
			.type(salon.phone).should('have.value', salon.phone)
		cy.get(`#${FORM.SALON}-email`)
			.type(salon.email).should('have.value', salon.email)
		cy.get(`#${FORM.SALON}-otherPaymentMethods`)
			.type(salon.paymentMethods).should('have.value', salon.paymentMethods)
		// cy.get('form').submit()
		/* cy.wait('@createSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
		}) */
		// cy.location('pathname').should('eq', '/api/b2b/admin/salons')
	})
})
