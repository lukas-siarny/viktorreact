import { CRUD_OPERATIONS, SALON_ID } from '../../enums'
import { FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

import smsCredit from '../../fixtures/smsCredit.json'

const smsCreditTestSuite = (actions: CRUD_OPERATIONS[]): void => {
	// Address of the salon must be filled in order to have walletID
	context('SMS Credit', () => {
		it('Recharge credit', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/salons/${salonID}/wallets/**`
			}).as('getWallet')
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/salons/${salonID}/notifications/sms/stats`
			}).as('getStats')
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/enums/sms-unit-prices/*'
			}).as('getSmsUnitPrice')
			cy.intercept({
				method: 'POST',
				pathname: '/admin/wallets/transactions'
			}).as('createTransaction')
			cy.visit(`/salons/${salonID}/sms-credit`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.get('main.ant-layout-content').then(($body) => {
					if (!$body.find('#sms-credit-no-wallet-id').length) {
						cy.wait('@getWallet').then((interceptionGetWallet: any) => {
							// check status code of login request
							expect(interceptionGetWallet.response.statusCode).to.equal(200)
							const walletID = interceptionGetWallet.response.body.wallet.id
							if ($body.find(`wallet_btn-${walletID}`).length) {
								cy.clickButton(walletID, 'wallet_btn')
								cy.wait(['@getStats', '@getSmsUnitPrice'])
								cy.setInputValue(FORM.RECHARGE_SMS_CREDIT, 'amount', smsCredit.update.amount)
								cy.setInputValue(FORM.RECHARGE_SMS_CREDIT, 'transactionNote', smsCredit.update.transactionNote)
								cy.clickButton(SUBMIT_BUTTON_ID, FORM.SMS_UNIT_PRICES_FORM)
								cy.wait('@createTransaction').then((interception: any) => {
									// check status code of login request
									expect(interception.response.statusCode).to.equal(200)
									// check conf toast message
									cy.checkSuccessToastMessage()
								})
							}
						})
					}
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default smsCreditTestSuite
