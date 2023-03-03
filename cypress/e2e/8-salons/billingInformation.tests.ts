import { FORM, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'
import salon from '../../fixtures/salon.json'
import { CRUD_OPERATIONS, SALON_ID } from '../../enums'
import { generateRandomString } from '../../support/helpers'

const billingInformationTestSuite = (actions: CRUD_OPERATIONS[]): void => {
	context('Billing information', () => {
		it('Update billing information', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/salons/${salonID}/invoice`
			}).as('updateBillingInfo')
			cy.visit(`/salons/${salonID}/billing-info`)
			// change input companyName for both cases
			cy.setInputValue(FORM.SALON_BILLING_INFO, 'companyName', salon.billingInfo.companyName)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'businessID', salon.billingInfo.businessID)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'vatID', salon.billingInfo.vatID)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'taxID', salon.billingInfo.taxID)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'firstName', salon.billingInfo.firstName)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'lastName', salon.billingInfo.lastName)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'email', `${generateRandomString(6)}_${salon.billingInfo.emailSuffix}`)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'phone', salon.billingInfo.phone)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'street', salon.billingInfo.street)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'streetNumber', salon.billingInfo.streetNumber)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'city', salon.billingInfo.city)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'zipCode', salon.billingInfo.zipCode)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.SALON_BILLING_INFO)
				cy.wait('@updateBillingInfo').then((interception: any) => {
					// check status code of login request
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			} else {
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.SALON_BILLING_INFO)
				cy.checkForbiddenModal()
			}
		})
	})
}

export default billingInformationTestSuite
