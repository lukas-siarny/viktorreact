// eslint-disable-next-line import/no-extraneous-dependencies
import { recurse } from 'cypress-recurse'
// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'node-html-parser'

import { generateRandomString } from '../../support/helpers'

// utils
import { CYPRESS_CLASS_NAMES, FORM } from '../../../src/utils/enums'

import user from '../../fixtures/user.json'

context('Auth', () => {
	const userEmail = `${generateRandomString(5)}_${user.emailSuffix}`

	it('Sign up', () => {
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

		// SMTP server has probably received the email
		recurse(() => cy.task('getLastEmail', userEmail), Cypress._.isString, {
			timeout: 60000, // retry up to 1 minute
			delay: 5000, // wait 5 seconds between attempts
			log: false
		}).then((email: string) => {
			// cy.log(email)
			const emailHtml = parse(email)
			const htmlTag = emailHtml.querySelector('#activation-code')
			if (htmlTag) {
				cy.log('Activation code: ', htmlTag.text)
				cy.visit('/activation')
				cy.intercept({
					method: 'POST',
					url: '/api/b2b/admin/users/activation'
				}).as('activation')
				cy.setValuesForPinField(FORM.ACTIVATION, 'code', htmlTag.text)
				cy.get('form').submit()
				cy.wait('@activation').then((interception: any) => {
					// check status code of registration request
					expect(interception.response.statusCode).to.equal(200)
					// take local storage snapshot
					cy.saveLocalStorage()
				})
			}
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
		cy.get(`.${CYPRESS_CLASS_NAMES.LOGOUT_BUTTON}`).click()
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
		cy.setInputValue(FORM.LOGIN, 'email', userEmail)
		cy.setInputValue(FORM.LOGIN, 'password', user.password)
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
