import { CYPRESS_CLASS_NAMES, FORM } from '../../../src/utils/enums'

// fixtures
import user from '../../fixtures/user.json'

// support
import { generateRandomString } from '../../support/helpers'
import { loginViaApi } from '../../support/e2e'

// enums
import { CRUD_OPERATIONS } from '../../enums'

const userCRUDTestSuit = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	// test id of user
	let userID = '0000000-0000-0000-0000-000000000009'

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

	it('Update my account info', () => {
		cy.visit('/')
		cy.get('.noti-my-account').click()
		cy.get(`.${CYPRESS_CLASS_NAMES.MY_ACCOUNT_BUTTON}`).click()
		cy.location('pathname').should('eq', '/my-account')
		cy.setInputValue(FORM.USER_ACCOUNT, 'firstName', user.firstName, false, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'lastName', user.lastName, false, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'phone', user.phone, false, true)
		cy.get('form').submit()
		cy.checkSuccessToastMessage()
	})

	it('Create partner', () => {
		cy.intercept({
			method: 'POST',
			url: '/api/b2b/admin/users'
		}).as('createPartner')
		cy.visit('/users/create')
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
			cy.setInputValue(FORM.ADMIN_CREATE_USER, 'email', `${generateRandomString(6)}_${user.emailSuffix}`)
			cy.setInputValue(FORM.ADMIN_CREATE_USER, 'phone', user.phone)
			cy.selectOptionDropdown(FORM.ADMIN_CREATE_USER, 'roleID', 'Partner')
			cy.get('form').submit()
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
				method: 'PATCH',
				url: `/api/b2b/admin/users/${userID}`
			}).as('updateUser')
			cy.setInputValue(FORM.USER_ACCOUNT, 'firstName', user.firstName, false, true)
			cy.setInputValue(FORM.USER_ACCOUNT, 'lastName', user.lastName, false, true)
			cy.get(`#${FORM.USER_ACCOUNT}-form`).submit()
			cy.wait('@updateUser').then((interception: any) => {
				// check status code of login request
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
			})
		} else {
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/roles/system-user'
			}).as('systemUser')
			cy.wait('@systemUser').then((interception: any) => {
				// check status code for be roles check
				expect(interception.response.statusCode).to.equal(403)
				// check redirect to 404 notfound page
				cy.location('pathname').should('eq', '/404')
			})
		}
	})

	it('Delete partner', () => {
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/users/${userID}`
		}).as('deleteUser')
		cy.visit(`/users/${userID}`)
		if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
			cy.clickDeleteButtonWithConfCustom(FORM.USER_ACCOUNT)
			cy.wait('@deleteUser').then((interception: any) => {
				// check status code
				expect(interception.response.statusCode).to.equal(200)
				// check conf toast message
				cy.checkSuccessToastMessage()
				cy.location('pathname').should('eq', `/users`)
			})
		} else {
			cy.intercept({
				method: 'GET',
				url: '/api/b2b/admin/roles/system-user'
			}).as('systemUser')
			cy.wait('@systemUser').then((interception: any) => {
				// check status code for be roles check
				expect(interception.response.statusCode).to.equal(403)
				// check redirect to 404 notfound page
				cy.location('pathname').should('eq', '/404')
			})
		}
	})
}

export default userCRUDTestSuit
