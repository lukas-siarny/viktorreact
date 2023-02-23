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

// TODO: upravit v antd-form fields kniznici a potom to pouzit odtial
Cypress.Commands.add('clickDeleteButtonWithConfCustom', (form?: string, key = 'delete-btn') => {
	cy.clickButton(key, form)
	// get popover conf box and click confirmation button
	cy.get('.ant-popover-inner-content', { timeout: 10000 }).should('be.visible').find('.ant-popconfirm-buttons > :nth-child(2)').click()
})

// TODO: upravit v antd-form fields kniznici a potom to pouzit odtial
Cypress.Commands.add('selectOptionDropdownCustom', (form: string, key: string, value?: string, force?: boolean) => {
	const elementId: string = form ? `#${form}-${key}` : `#${key}`
	cy.get(elementId).click({ force })
	if (value) {
		// check for specific value in dropdown
		cy.get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)', { timeout: 10000 })
			.should('be.visible')
			.find('.ant-select-item-option')
			.each((el: any) => {
				if (el.text() === value) {
					cy.wrap(el).click({ force })
				}
			})
	} else {
		// default select first option in list
		cy.get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)', { timeout: 10000 }).should('be.visible').find('.ant-select-item-option').first().click({ force: true })
	}
})

// TODO: upravit v antd-form fields kniznici a potom to pouzit odtial
Cypress.Commands.add(
	'setSearchBoxValueAndSelectFirstOptionCustom',
	(key: string, value: string, selectListKey: string, form?: string, googleGeocoding?: boolean, clear?: boolean, timeout?: number) => {
		const elementId: string = form ? `#${form}-${key}` : `#${key}`
		if (clear) {
			cy.get(elementId).clear().type(value, { timeout }).should('have.value', value)
		} else {
			cy.get(elementId).type(value, { timeout }).should('have.value', value)
		}
		cy.get(selectListKey, { timeout: 10000 }).should('be.visible')
		// select option for google geocoding list
		if (googleGeocoding) {
			cy.get(elementId).type('{downarrow}')
		}
		cy.get(elementId).type('{enter}')
	}
)
