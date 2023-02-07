/* eslint-disable import/no-extraneous-dependencies */
import 'cypress-localstorage-commands'
import '@goodrequest/antd-form-fields'
import initializeCustomCommands from '@goodrequest/antd-form-fields/dist/commands/cypressCommands'

initializeCustomCommands()

// eslint-disable-next-line import/prefer-default-export
Cypress.Commands.add('setValuesForPinField', (form: string, key: string, value: string) => {
	// const elementId: string = form ? `#${form}-${key}` : `#${key}`
	// TODO - check how to select pin inputs
	const nthInput = (n: number) => `.ant-form-item-control-input-content > :nth-child(${n})`
	const pin = [...value]
	pin.forEach((char: string, index) =>
		cy
			.get(nthInput(index + 1))
			.type(char)
			.should('have.value', char)
	)
})
