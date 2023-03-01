declare namespace Cypress {
	interface Chainable {
		/**
		 * Command to set value into pin filed
		 * @example cy.setValuesForPinField('FORM.test', 'test', '12345')
		 */
		setValuesForPinField(form: string, key: string, value: string): Chainable<Element>
		clickDeleteButtonWithConfCustom(form?: string, key?: string): Chainable<Element>
		checkForbiddenModal(): Chainable<Element>
		selectOptionDropdownCustom(form?: string, key?: string, value?: string, force?: boolean): Chainable<Element>
		setSearchBoxValueAndSelectFirstOptionCustom(
			key: string,
			value: string,
			selectListKey: string,
			form?: string,
			googleGeocoding?: boolean,
			clear?: boolean,
			timeout?: number
		): Chainable<Element>
		clickDropdownItem(triggerId: string, dropdownItemId?: string, force?: boolean): Chainable<Element>
		clickTab(tabKey: string, tabsKey?: string, force?: boolean): Chainable<Element>
		updateReviewStatus(currentStatus: REVIEW_VERIFICATION_STATUS, moderateItemKey: 'hide' | 'publish' | 'accept'): Chainable<Element>
		deleteReview(currentStatus: REVIEW_VERIFICATION_STATUS): Chainable<Element>
	}
}
