import { CRUD_OPERATIONS, EMPLOYEE_ID, SALON_ID } from '../../enums'
import { CREATE_EMPLOYEE_BUTTON_ID, DELETE_BUTTON_ID, FILTER_BUTTON_ID, FORM, PAGE, SUBMIT_BUTTON_ID } from '../../../src/utils/enums'

import { generateRandomString } from '../../support/helpers'

import user from '../../fixtures/user.json'
import customer from '../../fixtures/customer.json'

const getEmployee = () => {
	it('Open employee detail', () => {
		// get salonID from env
		const salonID = Cypress.env(SALON_ID)
		cy.intercept({
			method: 'GET',
			url: `/api/b2b/admin/${salonID}/employees`
		}).as('getEmployees')
		cy.visit('/')
		cy.wait(5000)
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
	const lastNameUpdate = generateRandomString(6)
	const employeeByInvitationEmail = `${generateRandomString(6)}_${user.create.emailSuffix}`
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

		it('Create employee by invitation', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/employees/invite'
			}).as('inviteEmployee')
			cy.visit(`/salons/${salonID}/employees/create`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
				// user can set only role that is not higher than his
				// not a 100% working solution, but it's better change of not failing test to select last item from the list then first
				// TODO: find better solution
				cy.get(`#${FORM.INVITE_EMPLOYEE}-roleID`).click({ force: true })
				cy.get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)', { timeout: 10000 })
					.should('be.visible')
					.find('.ant-select-item-option')
					.last()
					.click({ force: true })

				// wait for select dorpdown closing animation
				cy.wait(1000)
				cy.setInputValue(FORM.INVITE_EMPLOYEE, 'email', employeeByInvitationEmail, true)
				cy.clickButton(SUBMIT_BUTTON_ID, FORM.INVITE_EMPLOYEE)
				cy.wait('@inviteEmployee').then((interception: any) => {
					// check status code of login request
					expect(interception.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			} else {
				// check redirect to 403 unauthorized page
				cy.location('pathname').should('eq', '/403')
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
					cy.setInputValue(FORM.EMPLOYEE, 'lastName', lastNameUpdate, false, true)
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

		it('Resend employee invitation', () => {
			// get salonID, employeeID from env
			const salonID = Cypress.env(SALON_ID)
			const employeeID = Cypress.env(EMPLOYEE_ID)
			cy.intercept({
				method: 'GET',
				url: `/api/b2b/admin/employees/${employeeID}`
			}).as('getEmployee')
			cy.intercept({
				method: 'POST',
				url: '/api/b2b/admin/employees/invite'
			}).as('inviteEmployee')
			cy.visit(`/salons/${salonID}/employees/${employeeID}`)
			cy.wait('@getEmployee').then((interceptorGetEmployee: any) => {
				// check status code of login request
				expect(interceptorGetEmployee.response.statusCode).to.equal(200)
				if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
					cy.clickButton('invite-employee-btn')
					// wait for the animation
					cy.wait(1000)

					// user can set only role that is not higher than his
					// not a 100% working solution, but it's better change of not failing test to select last item from the list then first
					// TODO: find better solution
					cy.get(`#${FORM.INVITE_EMPLOYEE}-roleID`).click({ force: true })
					cy.get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)', { timeout: 10000 })
						.should('be.visible')
						.find('.ant-select-item-option')
						.last()
						.click({ force: true })

					// wait for select dorpdown closing animation
					cy.wait(1000)
					cy.setInputValue(FORM.INVITE_EMPLOYEE, 'email', `${generateRandomString(6)}_${customer.create.emailSuffix}`, true)
					cy.clickButton(SUBMIT_BUTTON_ID, FORM.INVITE_EMPLOYEE)
					cy.wait('@inviteEmployee').then((interception: any) => {
						// check status code of login request
						expect(interception.response.statusCode).to.equal(200)
						// check conf toast message
						cy.checkSuccessToastMessage()
					})
				} else {
					cy.clickButton('invite-employee-btn')
					cy.checkForbiddenModal()
				}
			})
		})
	})

	context('Employees', () => {
		it('Visit, filter and sort active employees', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/employees*`,
				query: {
					salonID
				}
			}).as('getEmployees')
			cy.visit(`/salons/${salonID}/employees`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@getEmployees').then((interceptionGetEmployees: any) => {
					// check status code
					expect(interceptionGetEmployees.response.statusCode).to.equal(200)

					// NOTE: at least one employee must exists in order to pagination be seen
					// change pagination
					cy.changePagination(50)
					cy.wait('@getEmployees').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// search employees
					cy.setInputValue(FORM.EMPLOYEES_FILTER, 'search', lastNameUpdate)
					cy.wait('@getEmployees').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// filter table
					cy.clickButton(FILTER_BUTTON_ID, FORM.EMPLOYEES_FILTER)
					// wait for animation
					cy.wait(1000)
					cy.selectOptionDropdownCustom(FORM.EMPLOYEES_FILTER, 'accountState', undefined, true)
					cy.wait('@getEmployees').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// sort table
					cy.sortTable('sortby-account-status')
					cy.wait('@getEmployees').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Visit, filter and sort deleted employees', () => {
			// get salonID from env
			const salonID = Cypress.env(SALON_ID)
			cy.intercept({
				method: 'GET',
				pathname: `/api/b2b/admin/employees*`,
				query: {
					salonID
				}
			}).as('getEmployees')
			cy.visit(`/salons/${salonID}/employees`)
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@getEmployees').then((interceptionGetEmployees: any) => {
					// check status code
					expect(interceptionGetEmployees.response.statusCode).to.equal(200)

					// search employees
					cy.setInputValue(FORM.EMPLOYEES_FILTER, 'search', generateRandomString(6), true)
					cy.wait('@getEmployees').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// filter table
					cy.clickButton(FILTER_BUTTON_ID, FORM.EMPLOYEES_FILTER)
					// wait for animation
					// cy.wait(1000)
					// cy.selectOptionDropdownCustom(FORM.EMPLOYEES_FILTER, 'serviceID', undefined, true)

					// sort table
					cy.sortTable('sortby-name')
					cy.wait('@getEmployees').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
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
