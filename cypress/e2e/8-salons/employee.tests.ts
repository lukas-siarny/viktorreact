import { CRUD_OPERATIONS, EMPLOYEE_ID, SALON_ID } from '../../enums'
import { CREATE_EMPLOYEE_BUTTON_ID, DELETE_BUTTON_ID, FORM, PAGE, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

import { generateRandomString } from '../../support/helpers'

import user from '../../fixtures/user.json'
import customer from '../../fixtures/customer.json'

const getEmployee = () => {
	it('Open customer detail', () => {
		// get salonID from env
		const salonID = Cypress.env(SALON_ID)
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/${salonID}/employees`
		}).as('getEmployees')
		cy.visit('/')
		cy.get(`#${PAGE.EMPLOYEES}`).click()
		cy.wait('@getEmployees')
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/${salonID}/employees/*`
		}).as('getEmployee')
		cy.get('[index="0"] > .ant-table-column-sort').click()
		cy.wait('@getEmployee').then((interception: any) => {
			// check status code
			expect(interception.response.statusCode).to.equal(200)
			const employeeID = interception.response.body.salon.id
			Cypress.env(EMPLOYEE_ID, employeeID)
			cy.location('pathname').should('eq', `/salons/${salonID}/employees/${employeeID}`)
			cy.log(`EMPLOYEE_ID: ${employeeID}`)
		})
	})
}

const employeeTestSuite = (actions: CRUD_OPERATIONS[]): void => {
	context('Employee', () => {
		it('Create employee', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/employees'
			}).as('createEmployee')
			cy.visit(`/salons/${salonID}/employees/create`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
				cy.setInputValue(FORM.EMPLOYEE, 'firstName', generateRandomString(6))
				cy.setInputValue(FORM.EMPLOYEE, 'lastName', generateRandomString(6))
				cy.setInputValue(FORM.EMPLOYEE, 'email', `${generateRandomString(6)}_${user.create.emailSuffix}`)
				cy.setInputValue(FORM.EMPLOYEE, 'phone', customer.create.phone)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.EMPLOYEE)
				cy.wait('@createEmployee').then((interception: any) => {
					// check status code of login request
					expect(interception.response.statusCode).to.equal(200)
					Cypress.env(EMPLOYEE_ID, interception.response.body.employee.id)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')

				// check for forbidden modal in employees page
				cy.visit(`/salons/${salonID}/employees`)
				cy.clickButton(CREATE_EMPLOYEE_BUTTON_ID)
				cy.checkForbiddenModal()

				getEmployee()
			}
		})

		it('Update employee', () => {
			// get salonID, employeeID from env
			const salonID = Cypress.env(SALON_ID)
			const employeeID = Cypress.env(EMPLOYEE_ID)
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/employees/${employeeID}`
			}).as('getEmployee')
			cy.intercept({
				method: 'PATCH',
				url: `/api/b2b/admin/employees/${employeeID}`
			}).as('updateEmployee')
			cy.visit(`/salons/${salonID}/employees/${employeeID}`)
			cy.wait('@getEmployee').then((interceptorGetEmployee: any) => {
				// check status code of login request
				expect(interceptorGetEmployee.response.statusCode).to.equal(200)
				// change input firstName for both cases
				cy.setInputValue(FORM.EMPLOYEE, 'firstName', generateRandomString(6), false, true)
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.UPDATE)) {
					cy.setInputValue(FORM.EMPLOYEE, 'lastName', generateRandomString(6), false, true)
					cy.setInputValue(FORM.EMPLOYEE, 'email', `${generateRandomString(6)}_${customer.create.emailSuffix}`, false, true)
					cy.setInputValue(FORM.EMPLOYEE, 'phone', customer.create.phone, false, true)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.EMPLOYEE)
					cy.wait('@updateEmployee').then((interception: any) => {
						// check status code of login request
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				} else {
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.EMPLOYEE)
					cy.checkForbiddenModal()
				}
			})
		})
	})
}

export const deleteEmployee = (actions: CRUD_OPERATIONS[]) => {
	it('Delete employee', () => {
		// get salonID, employeeID from env
		const salonID = Cypress.env(SALON_ID)
		const employeeID = Cypress.env(EMPLOYEE_ID)
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/employees/${employeeID}`
		}).as('getEmployee')
		cy.intercept({
			method: 'DELETE',
			url: `/api/b2b/admin/employees/${employeeID}`
		}).as('deleteEmployee')
		cy.visit(`/salons/${salonID}/employees/${employeeID}`)
		cy.wait('@getEmployee').then((interceptorGetEmployee: any) => {
			// check status code of login request
			expect(interceptorGetEmployee.response.statusCode).to.equal(200)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.DELETE)) {
				cy.clickDeleteButtonWithConfCustom(FORM.EMPLOYEE)
				cy.wait('@deleteEmployee').then((interception: any) => {
					// check status code
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
					cy.location('pathname').should('eq', `/salons/${salonID}/employees`)
				})
			} else {
				cy.clickButton(FORM.EMPLOYEE, DELETE_BUTTON_ID)
				cy.checkForbiddenModal()
			}
		})
	})
}

export default employeeTestSuite
