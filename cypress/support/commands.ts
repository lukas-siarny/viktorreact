/* eslint-disable import/no-extraneous-dependencies */
import 'cypress-localstorage-commands'
import '@goodrequest/antd-form-fields'
import initializeCustomCommands from '@goodrequest/antd-form-fields/dist/commands/cypressCommands'
import { CYPRESS_CLASS_NAMES } from '../../src/utils/enums'

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

// TODO: upravit v antd-form fields kniznici a potom to pouzit odtial
Cypress.Commands.add('clickDeleteButtonWithConfCustom', (form?: string, key = 'delete-btn') => {
	cy.clickButton(key, form)
	// get popover conf box and click confirmation button
	cy.get('.ant-popover-inner-content', { timeout: 10000 }).should('be.visible').find('.ant-popconfirm-buttons > :nth-child(2)').click()
})

Cypress.Commands.add('checkForbiddenModal', () => {
	cy.get(`.${CYPRESS_CLASS_NAMES.FORBIDDEN_MODAL}`).find('.ant-result-title').should('have.text', 'You do not have sufficient credentials for this action')
})
