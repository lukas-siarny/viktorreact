import { includes } from 'lodash'
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

// TODO: upravit v antd-form fields kniznici a potom to pouzit odtial
Cypress.Commands.add('selectOptionDropdownCustom', (form?: string, key?: string, value?: string, force?: boolean) => {
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

// TODO: pridat v antd-form fields kniznici a potom to pouzit odtial
Cypress.Commands.add('clickDropdownItem', (triggerId: string, dropdownItemId?: string, force?: boolean) => {
	cy.get(triggerId).click({ force })
	if (dropdownItemId) {
		// check for specific value in dropdown
		cy.get('.ant-dropdown :not(.ant-dropdown-hidden)', { timeout: 10000 })
			.should('be.visible')
			.find('.ant-dropdown-menu-item')
			.each((el: any) => {
				if (el.has(dropdownItemId)) {
					cy.wrap(el).click({ force })
				}
			})
	} else {
		// default select first item in list
		cy.get('.ant-dropdown :not(.ant-dropdown-hidden)', { timeout: 10000 }).should('be.visible').find('.ant-dropdown-menu-item').first().click({ force: true })
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

Cypress.Commands.add('clickTab', (tabKey: string, tabsKey = '.ant-tabs-nav-list', force?: boolean) => {
	cy.get(tabsKey).find(`[data-node-key="${tabKey}"]`).click({ force })
})

Cypress.Commands.add('setDateInputValue', (form?: string, key?: string, value?: string, selectNextYear?: boolean) => {
	const elementId: string = form ? `#${form}-${key}` : `#${key}`
	cy.get(elementId).click({ force: true })

	if (selectNextYear) {
		cy.get('.ant-picker-dropdown :not(.ant-picker-dropdown-hidden)', { timeout: 2000 }).should('be.visible').find('.ant-picker-header-super-next-btn').click({ force: true })
	}

	if (value) {
		cy.get('.ant-picker-dropdown :not(.ant-picker-dropdown-hidden)', { timeout: 2000 }).should('be.visible').find(`.ant-picker-cell[title="${value}"]`).click({ force: true })
	} else {
		cy.get('.ant-picker-dropdown :not(.ant-picker-dropdown-hidden)', { timeout: 2000 }).should('be.visible').find('.ant-picker-cell').first().click({ force: true })
	}
})

Cypress.Commands.add('sortTable', (key: string, tableKey = '.ant-table') => {
	cy.get(tableKey).find('.ant-table-column-has-sorters').find(`#${key}`).click({ force: true })
})

Cypress.Commands.add('changePagination', (limit: 25 | 50 | 100 = 25, tableKey = '.noti-table-wrapper', useCustomPagination = true) => {
	if (useCustomPagination) {
		cy.get(tableKey).find('.table-footer-custom-pagination .custom-dropdown').as('customDropdown')
		cy.get('@customDropdown').find('button.selector').click({ force: true })
		cy.get('@customDropdown').find('.custom-dropdown-menu').should('be.visible')
		cy.get('@customDropdown')
			.find('li')
			.each((el: any) => {
				if (el.text().includes(limit)) {
					cy.wrap(el).click({ force: true })
				}
			})
	} else {
		// TODO: pre antd paginaciu
	}
})
