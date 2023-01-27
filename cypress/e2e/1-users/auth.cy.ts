// eslint-disable-next-line import/no-extraneous-dependencies
import { recurse } from 'cypress-recurse'

// utils
import { FORM } from '../../../src/utils/enums'

import user from '../../fixtures/user.json'

const nthInput = (n: number) => `#ACTIVATION-code > :nth-child(${n})`

context('Auth', () => {
	let userEmail: string

	before(() => {
		// get and check the test email only once before the tests
		cy.task('getUserEmail').then((emailUser: any) => {
			cy.log('Email address:', emailUser.email)
			expect(emailUser.email).to.be.a('string')
			userEmail = emailUser.email
			userName = emailUser.email.replace('@ethereal.email', '')
		})
	})

	it('Sign up', async () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/users/registration'
		}).as('registration')
		cy.visit('/signup')
		cy.setInputValue(FORM.REGISTRATION, 'email', userEmail)
		cy.setInputValue(FORM.REGISTRATION, 'password', user.password)
		cy.setInputValue(FORM.REGISTRATION, 'phone', user.phone)
		cy.clickButton('gdpr', FORM.REGISTRATION, true)
		cy.clickButton('marketing', FORM.REGISTRATION, true)
		cy.get('form').submit()
		cy.wait('@registration').then((interception: any) => {
			// check status code of registration request
			expect(interception.response.statusCode).to.equal(200)
			// take local storage snapshot
			cy.saveLocalStorage()
		})
		// check redirect to activation page
		cy.location('pathname').should('eq', '/activation')

		// retry fetching the email
		recurse(
			() => cy.task('getLastEmail'), // Cypress commands to retry
			Cypress._.isObject, // keep retrying until the task returns an object
			{
				timeout: 60000, // retry up to 1 minute
				delay: 5000 // wait 5 seconds between attempts
			}
		)
			.its('html')
			.then((html: any) => {
				cy.document({ log: false }).invoke({ log: false }, 'write', html)
				cy.get('strong')
					.invoke('text')
					.then((txt) => {
						cy.log('Activation code is: ', txt.toString())
						const activationCode: string = txt.toString()
						cy.visit('/activation')
						cy.intercept({
							method: 'POST',
							url: '/api/b2b/admin/users/activation'
						}).as('activation')
						cy.get(nthInput(1)).type(activationCode[0]).should('have.value', activationCode[0])
						cy.get(nthInput(2)).type(activationCode[1]).should('have.value', activationCode[1])
						cy.get(nthInput(3)).type(activationCode[2]).should('have.value', activationCode[2])
						cy.get(nthInput(4)).type(activationCode[3]).should('have.value', activationCode[3])
						cy.get(nthInput(5)).type(activationCode[4]).should('have.value', activationCode[4])
						cy.get(nthInput(6)).type(activationCode[5]).should('have.value', activationCode[5])
						cy.get('form').submit()
						cy.wait('@activation').then((interception: any) => {
							// check status code of registration request
							expect(interception.response.statusCode).to.equal(200)
							// take local storage snapshot
							cy.saveLocalStorage()
						})
					})
			})
	})

	it('Sign out', () => {
		cy.restoreLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/logout'
		}).as('authLogout')
		cy.visit('/')
		cy.get('.noti-my-account').click()
		cy.get('#logOut').click()
		cy.wait('@authLogout').then((interception: any) => {
			// check status code of logout request
			expect(interception.response.statusCode).to.equal(200)
			// check if tokens are erased
			assert.isNull(localStorage.getItem('refresh_token'))
			assert.isNull(localStorage.getItem('access_token'))
		})
		// check redirect to login page
		cy.location('pathname').should('eq', '/login')
	})

	it('Sign in', () => {
		cy.clearLocalStorage()
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/auth/login'
		}).as('authLogin')
		cy.visit('/login')
		cy.setInputValue(FORM.LOGIN, 'email', Cypress.env('auth_email'))
		cy.setInputValue(FORM.LOGIN, 'password', Cypress.env('auth_password'))
		cy.get('form').submit()
		cy.wait('@authLogin').then((interception: any) => {
			// check status code of login request
			expect(interception.response.statusCode).to.equal(200)
			// take local storage snapshot
			cy.saveLocalStorage()
		})
		// check redirect to home page
		cy.location('pathname').should('eq', '/')
	})
})
