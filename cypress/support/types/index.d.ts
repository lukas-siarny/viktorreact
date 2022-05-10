import './commands'

declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Command to login into app via api endpoint
			 * @example cy.apiAuth('test@test.com', 't123')
			 */
			apiAuth(email: string, password: string): Chainable<Element>
			/**
			 * Command to get input and set value
			 * attribute clear input value before its set
			 * @example cy.setInputValue('LOGIN', 'email', 'test@test.com')
			 */
			setInputValue(form: string, key: string, value: string, clear?: boolean): Chainable<Element>
			/**
			 * Command to get dropdown and select option
			 * default selecting first option
			 * @example cy.selectOptionDropdown('ADMIN_CREATE_USER', 'roleID', 'partner')
			 */
			selectOptionDropdown(form: string, key: string, value?: string)
			/**
			 * Command to get search box, set value and select first listed option
			 * attribute clear input value before its set
			 * @example cy.setSearchBoxValueAndSelectFirstOption('email', 'test@test.com', 'LOGIN')
			 */
			setSearchBoxValueAndSelectFirstOption(key: string, value: string, elementKey: string, form?: string, googleGeocoding?: boolean, clear?: boolean): Chainable<Element>
			/**
			 * Command to upload file
			 * @example cy.uploadFile('image', '../images/test.jpg', 'SALON')
			 */
			uploadFile(key: string, filePath: string, form?: string)
			/**
			 * Command to click button
			 * attribute switchBtn => is for click switch
			 * @example cy.clickToggleButton('gdpr', 'REGISTRATION', 'toggle')
			 */
			clickButton(key: string, form?: string, switchBtn?: boolean)
			/**
			 * Command to click delete button with confirmation popover
			 * attribute switchBtn => is for click switch
			 * @example cy.clickDeleteButtonWithConf('delete-btn', 'SALON')
			 */
			clickDeleteButtonWithConf(form?: string, key: string = 'delete-btn')
			/**
			 * Command to check success toast message
			 * @example cy.checkSuccessToastMessage()
			 */
			checkSuccessToastMessage()
		}
	}
}
