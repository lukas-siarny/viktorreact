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
	pin.forEach((char: string, index) => cy.get(nthInput(index)).type(char).should('have.value', char))
})
