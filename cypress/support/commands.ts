/* eslint-disable import/no-extraneous-dependencies */
import 'cypress-localstorage-commands'
import '@goodrequest/antd-form-fields'
import initializeCustomCommands from '@goodrequest/antd-form-fields/dist/commands/cypressCommands'

import { REVIEWS_TAB_KEYS, REVIEW_VERIFICATION_STATUS, CYPRESS_CLASS_NAMES } from '../../src/utils/enums'

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

Cypress.Commands.add('updateReviewStatus', (currentStatus: REVIEW_VERIFICATION_STATUS, moderateItemKey: 'hide' | 'publish' | 'accept') => {
	cy.intercept({
		method: 'GET',
		pathname: '/api/b2b/admin/reviews/'
	}).as('getReviews')
	cy.visit('/reviews')
	cy.wait('@getReviews').then((interceptorGetReviews: any) => {
		expect(interceptorGetReviews.response.statusCode).to.equal(200)
		cy.get(`[data-row-key*="${currentStatus}"]`)
			.invoke('attr', 'data-row-key')
			.then((dataRowKey) => {
				const split = (dataRowKey || '').split('_')
				const reviewId = split[split.length - 1]

				cy.intercept({
					method: 'PATCH',
					pathname: `/api/b2b/admin/reviews/${reviewId}/verification`
				}).as('updateReviewStatus')
				const triggerId = `#moderate_btn-${reviewId}`
				cy.clickDropdownItem(triggerId, `moderate-${moderateItemKey}-message`, true)
				cy.wait('@updateReviewStatus').then((interceptionUpdateReview: any) => {
					// check status code of request
					expect(interceptionUpdateReview.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
				})
			})
	})
})

Cypress.Commands.add('deleteReview', (currentStatus: REVIEW_VERIFICATION_STATUS) => {
	cy.intercept({
		method: 'GET',
		pathname: '/api/b2b/admin/reviews/'
	}).as('getReviews')
	cy.visit('/reviews')
	cy.wait('@getReviews').then((interceptorGetReviews: any) => {
		expect(interceptorGetReviews.response.statusCode).to.equal(200)
		cy.get(`[data-row-key*="${currentStatus}"]`)
			.invoke('attr', 'data-row-key')
			.then((dataRowKey) => {
				const split = (dataRowKey || '').split('_')
				const reviewId = split[split.length - 1]

				cy.intercept({
					method: 'DELETE',
					pathname: `/api/b2b/admin/reviews/${reviewId}`
				}).as('deleteReview')
				cy.clickDeleteButtonWithConfCustom('delete_btn', reviewId)
				cy.wait('@deleteReview').then((interceptionDeleteReview: any) => {
					// check status code of request
					expect(interceptionDeleteReview.response.statusCode).to.equal(200)
					// check conf toast message
					cy.checkSuccessToastMessage()
					cy.clickTab(REVIEWS_TAB_KEYS.DELETED)
					cy.wait('@getReviews').then((interceptorGetDeletedReviews: any) => {
						expect(interceptorGetDeletedReviews.response.statusCode).to.equal(200)
						cy.get(`[data-row-key*="${reviewId}"]`).should('be.visible')
					})
				})
			})
	})
})
