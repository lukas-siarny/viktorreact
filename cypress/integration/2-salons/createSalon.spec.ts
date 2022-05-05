// utils
import { FORM } from '../../../src/utils/enums'

const salon = require('../../fixtures/salon.json')

context('Salon', () => {
	// id of created salon
	let createdSalonID: number = 0
	beforeEach(() => {
		// restore local storage with tokens from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	it('Create salon as ADMIN user', () => {
		// prepare image for upload
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/salons',
		}).as('createSalon')
		cy.visit('/salons/create')
		cy.get(`#${FORM.SALON}-name`)
			.type(salon.create.name).should('have.value', salon.create.name)
		cy.get(`#${FORM.SALON}-gallery`).attachFile('../images/test.jpg')
		cy.get(`#${FORM.SALON}-phone`)
			.type(salon.create.phone).should('have.value', salon.create.phone)
		cy.get(`#${FORM.SALON}-email`)
			.type(salon.create.email).should('have.value', salon.create.email)
		cy.get('#address-search')
			.type('Kosice, Rampova 2, Slovakia').should('have.value', 'Kosice, Rampova 2, Slovakia')
		cy.get('.pac-item', { timeout: 10000 }).should('be.visible')
		cy.get('#address-search').type('{downarrow}')
		cy.get('#address-search').type('{enter}')
		/* cy.get('#google-view-map')
			.trigger('mousedown', { which: 1 })
			.trigger('mousemove', { which: 1, x: 261, y: 0 })
			.trigger('mouseup')
			.wait(500); */
		cy.get(`#${FORM.SALON}-otherPaymentMethods`)
			.type(salon.create.paymentMethods).should('have.value', salon.create.paymentMethods)
		cy.get(`#${FORM.SALON}-userID`).type('t').should('have.value', 't')
		cy.get(`.rc-virtual-list`, { timeout: 10000 }).should('be.visible')
		cy.get(`#${FORM.SALON}-userID`).type('{downarrow}')
		cy.get(`#${FORM.SALON}-userID`).type('{enter}')
		cy.get('form').submit()
		cy.wait('@createSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			createdSalonID = interception.response.body.id
		})
		cy.location('pathname').should('eq', `/salons/${createdSalonID}`)
	})

	/* it('update created salon as ADMIN user', () => {
		cy.intercept({
			method: 'PATCH',
			url: `/api/b2b/admin/salons/${createdSalonID}`,
		}).as('updateSalon')
		cy.visit(`/salons/${createdSalonID}`)
		cy.get(`#${FORM.SALON}-name`)
			.type(salon.update.name).should('have.value', salon.update.name)
		cy.get('form').submit()
		cy.wait('@updateSalon').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			expect(interception.response.body.name).to.equal(salon.update.name)
		})
	}) */
})
