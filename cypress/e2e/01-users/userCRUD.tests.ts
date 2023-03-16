import user from '../../fixtures/user.json'

// support
import { generateRandomString } from '../../support/helpers'
import { loginViaApi } from '../../support/e2e'

// enums
import { SUBMIT_BUTTON_ID, FORM } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const userCRUDTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	// test id of user
	let userID = ''

	before(() => {
		loginViaApi(email, password)
	})

	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	it('Create partner', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/users'
		}).as('createPartner')
		cy.visit('/users/create')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
			cy.setInputValue(FORM.ADMIN_CREATE_USER, 'email', `${generateRandomString(6)}_${user.create.emailSuffix}`)
			cy.setInputValue(FORM.ADMIN_CREATE_USER, 'phone', user.create.phone)
			cy.selectOptionDropdown(FORM.ADMIN_CREATE_USER, 'roleID', 'Partner')
			cy.clickButton(SUBMIT_BUTTON_ID, FORM.ADMIN_CREATE_USER)
			cy.wait('@createPartner').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				userID = interception.response.body.user.id
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Update partner info', () => {
		cy.visit(`/users/${userID}`)
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/users/${userID}`
			}).as('getUser')
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/users/${userID}`
			}).as('updateUser')
			cy.wait('@getUser').then((interceptorGetUser: any) => {
				// check status code of get user detail data request
				expect(interceptorGetUser.response.statusCode).to.equal(200)
				cy.setInputValue(FORM.USER_ACCOUNT, 'firstName', user.update.firstName, false, true)
				cy.setInputValue(FORM.USER_ACCOUNT, 'lastName', user.update.lastName, false, true)
				cy.setInputValue(FORM.USER_ACCOUNT, 'phone', user.update.phone, false, true)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.USER_ACCOUNT)
				cy.wait('@updateUser').then((interception: any) => {
					// check status code of login request
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})

	it('Delete partner', () => {
		cy.visit(`/users/${userID}`)
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/users/${userID}`
			}).as('getUser')
			cy.intercept({
				method: 'DELETE',
				url: `/api/b2b/admin/users/${userID}`
			}).as('deleteUser')
			cy.wait('@getUser').then((interceptorGetUser: any) => {
				// check status code of login request
				expect(interceptorGetUser.response.statusCode).to.equal(200)
				cy.clickDeleteButtonWithConfCustom(FORM.USER_ACCOUNT)
				cy.wait('@deleteUser').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
					cy.location('pathname').should('eq', `/users`)
				})
			})
		} else {
			// check redirect to 403 unauthorized page
			cy.location('pathname').should('eq', '/403')
		}
	})
}

export default userCRUDTestSuite