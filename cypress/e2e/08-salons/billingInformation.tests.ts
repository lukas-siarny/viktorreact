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
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'companyName', salon.billingInfo.companyName)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'businessID', salon.billingInfo.businessID, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'vatID', salon.billingInfo.vatID, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'taxID', salon.billingInfo.taxID, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'firstName', salon.billingInfo.firstName, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'lastName', salon.billingInfo.lastName, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'email', `${generateRandomString(6)}_${salon.billingInfo.emailSuffix}`, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'phone', salon.billingInfo.phone, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'street', salon.billingInfo.street, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'streetNumber', salon.billingInfo.streetNumber, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'city', salon.billingInfo.city, true, true)
				cy.setInputValue(FORM.SALON_BILLING_INFO, 'zipCode', salon.billingInfo.zipCode, true, true)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.SALON_BILLING_INFO)
				cy.wait('@updateBillingInfo').then((interception: any) => {
					// check status code of login request
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			} else if (actions.includes(CRUD_OPERATIONS.READ)) {
				// all form input fields should be disabled
				cy.get(`#${FORM.SALON_BILLING_INFO}-companyName`).should('be.disabled')
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default billingInformationTestSuite
