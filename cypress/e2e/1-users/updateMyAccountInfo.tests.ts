import { CYPRESS_CLASS_NAMES, FORM } from '../../../src/utils/enums'

// fixtures
import user from '../../fixtures/user.json'

// support
import { loginViaApi } from '../../support/e2e'

const updateMyAccountTestSuit = (email?: string, password?: string): void => {
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
		cy.get(`.${CYPRESS_CLASS_NAMES.MY_ACCOUNT}`).click()
		cy.get(`.${CYPRESS_CLASS_NAMES.MY_ACCOUNT_BUTTON}`).click()
		cy.location('pathname').should('eq', '/my-account')
		cy.setInputValue(FORM.USER_ACCOUNT, 'firstName', user.updateMyAccount.firstName, false, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'lastName', user.updateMyAccount.lastName, false, true)
		cy.setInputValue(FORM.USER_ACCOUNT, 'phone', user.updateMyAccount.phone, false, true)
		cy.get('form').submit()
		cy.checkSuccessToastMessage()
	})
}

export default updateMyAccountTestSuit
