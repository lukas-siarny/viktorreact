/* eslint-disable import/no-extraneous-dependencies */
import 'cypress-localstorage-commands'
import '@goodrequest/antd-form-fields'
import initializeCustomCommands from '@goodrequest/antd-form-fields/dist/commands/cypressCommands'

initializeCustomCommands()

// eslint-disable-next-line import/prefer-default-export
Cypress.Commands.add('setValuesForPinField', (form: string, key: string, value: string) => {
	const elementId: string = form ? `#${form}-${key}` : `#${key}`
	const nthInput = (n: number) => `${elementId} > :nth-child(${n})`
	const pin = [...value]
	pin.forEach((char: string, index) =>
		cy
			.get(nthInput(index + 1))
			.type(char)
			.should('have.value', char)
	)
})

// TODO: upravit v antd-form fields kniznicy a potom to pouzit odtial
Cypress.Commands.add('clickDeleteButtonWithConfCustom', (form?: string, key = 'delete-btn') => {
	cy.clickButton(key, form)
	// get popover conf box and click confirmation button
	cy.get('.ant-popover-inner-content', { timeout: 10000 }).should('be.visible').find('.ant-popconfirm-buttons > :nth-child(2)').click()
})
