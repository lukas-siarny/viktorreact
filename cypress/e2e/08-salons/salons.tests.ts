import { loginViaApi } from '../../support/e2e'

// enums
import { FORM, SUBMIT_BUTTON_ID, FILTER_BUTTON_ID, IMPORT_BUTTON_ID, ROW_BUTTON_WITH_ID } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

const salonsTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
	before(() => {
		loginViaApi(email, password)
	})

	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	context('Salons', () => {
		it('Visit, filter and sort active salons', () => {
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/salons*'
			}).as('getSalons')
			cy.visit('/salons')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@getSalons').then((interceptionGetSalons: any) => {
					// check status code
					expect(interceptionGetSalons.response.statusCode).to.equal(200)

					// sort table
					cy.sortTable('sortby-title')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// change pagination
					cy.changePagination(50)
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// NOTE: at least two active salons must exists in order to search be enabled
					// search salons
					cy.setInputValue(FORM.SALONS_FILTER_ACITVE, 'search', 'Salon 5')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
					cy.setInputValue(FORM.SALONS_FILTER_ACITVE, 'search', '')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// filter table
					cy.clickButton(FILTER_BUTTON_ID, FORM.SALONS_FILTER_ACITVE)
					// wait for animation
					cy.wait(1000)
					cy.selectOptionDropdownCustom(FORM.SALONS_FILTER_ACITVE, 'statuses_published', undefined, true)
					cy.selectOptionDropdownCustom(FORM.SALONS_FILTER_ACITVE, 'statuses_changes', undefined, true)
					cy.selectOptionDropdownCustom(FORM.SALONS_FILTER_ACITVE, 'createType', undefined, true)
					cy.selectOptionDropdownCustom(FORM.SALONS_FILTER_ACITVE, 'sourceType', undefined, true)
					cy.selectOptionDropdownCustom(FORM.SALONS_FILTER_ACITVE, 'premiumSourceUserType', undefined, true)
					cy.selectOptionDropdownCustom(FORM.SALONS_FILTER_ACITVE, 'categoryFirstLevelIDs', undefined, true)
					cy.selectOptionDropdownCustom(FORM.SALONS_FILTER_ACITVE, 'hasSetOpeningHours', undefined, true)
					// cy.get(`#${FORM.SALONS_FILTER_ACITVE}-dateFromTo`).find('input').first().click({ force: true })
					// cy.get('.ant-picker-dropdown :not(.ant-picker-dropdown-hidden)', { timeout: 2000 }).should('be.visible').find('.ant-picker-presets > ul > li').first().click()
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
					// clear filter
					cy.clearDropdownSelection('statuses_published')
					cy.clearDropdownSelection('statuses_changes')
					cy.clearDropdownSelection('createType')
					cy.clearDropdownSelection('sourceType')
					cy.clearDropdownSelection('premiumSourceUserType')
					cy.clearDropdownSelection('categoryFirstLevelIDs')
					cy.clearDropdownSelection('hasSetOpeningHours')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Import salons', () => {
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/salons'
			}).as('getSalons')
			cy.intercept({
				method: 'POST',
				pathname: '/api/b2b/admin/imports/salons'
			}).as('importSalons')
			cy.visit('/salons')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@getSalons').then((interceptionGetSalons: any) => {
					// check status code
					expect(interceptionGetSalons.response.statusCode).to.equal(200)

					if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.CREATE)) {
						cy.clickButton(IMPORT_BUTTON_ID(), FORM.SALONS_FILTER_ACITVE)
						// wait for animation
						cy.wait(2000)
						cy.uploadFile('file', '../files/basicsalons.xlsx', FORM.IMPORT_FORM)
						cy.clickButton(SUBMIT_BUTTON_ID, FORM.IMPORT_FORM)
						cy.wait('@importSalons').then((interception: any) => {
							// check status code
							expect(interception.response.statusCode).to.equal(200)
							// check conf toast message
							cy.checkSuccessToastMessage()
						})
					} else {
						cy.clickButton(IMPORT_BUTTON_ID(), FORM.SALONS_FILTER_ACITVE)
						cy.checkForbiddenModal()
					}
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Visit, filter and sort deleted salons', () => {
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/salons*'
			}).as('getSalons')
			cy.visit('/salons?salonState=deleted')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@getSalons').then((interceptionGetSalons: any) => {
					// check status code
					expect(interceptionGetSalons.response.statusCode).to.equal(200)

					// sort table
					cy.sortTable('sortby-title')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// change pagination
					cy.changePagination(50)
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// NOTE: at least two deleted salons must exists in order to search be enabled
					// search salons
					cy.setInputValue(FORM.SALONS_FILTER_DELETED, 'search', 'Salon 5')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
					// clear search
					cy.setInputValue(FORM.SALONS_FILTER_DELETED, 'search', '')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// filter table
					cy.clickButton(FILTER_BUTTON_ID, FORM.SALONS_FILTER_DELETED)
					// wait for animation
					cy.wait(1000)
					cy.selectOptionDropdownCustom(FORM.SALONS_FILTER_DELETED, 'categoryFirstLevelIDs', undefined, true)
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
					// clear filter
					cy.clearDropdownSelection('categoryFirstLevelIDs')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Visit, filter and sort rejected salons', () => {
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/salons/rejected-suggestions*'
			}).as('getRejectedSuggestions')
			cy.visit('/salons?salonState=mistakes')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@getRejectedSuggestions').then((interceptionGetSalons: any) => {
					// check status code
					expect(interceptionGetSalons.response.statusCode).to.equal(200)

					// sort table
					cy.sortTable('sortby-title')
					cy.wait('@getRejectedSuggestions').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// change pagination
					cy.changePagination(50)
					cy.wait('@getRejectedSuggestions').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// NOTE: at least two rejected suggestions must exists in order to search be enabled
					// search
					cy.setInputValue(FORM.FILTER_REJECTED_SUGGESTIONS, 'search', 'Salon 5')
					cy.wait('@getRejectedSuggestions').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
					// clear search
					cy.setInputValue(FORM.FILTER_REJECTED_SUGGESTIONS, 'search', '')
					cy.wait('@getRejectedSuggestions').then((interception: any) => expect(interception.response.statusCode).to.equal(200))

					// filter table
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
					// clear filter
					cy.clearDropdownSelection('categoryFirstLevelIDs')
					cy.wait('@getSalons').then((interception: any) => expect(interception.response.statusCode).to.equal(200))
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})

		it('Delete rejected suggestion', () => {
			cy.intercept({
				method: 'GET',
				pathname: '/api/b2b/admin/salons/rejected-suggestions*'
			}).as('getRejectedSuggestions')
			cy.visit('/salons?salonState=mistakes')
			if (actions.includes(CRUD_OPERATIONS.ALL) || actions.includes(CRUD_OPERATIONS.READ)) {
				cy.wait('@getRejectedSuggestions').then((interceptionGetRejectedSuggestions: any) => {
					// check status code
					expect(interceptionGetRejectedSuggestions.response.statusCode).to.equal(200)
					cy.get('.ant-table-row:first')
						.as('firstRow')
						.invoke('attr', 'data-row-key')
						.then((salonID) => {
							cy.intercept({
								method: 'DELETE',
								pathname: `/api/b2b/admin/salons/${salonID}/rejected-suggestions`
							}).as('deleteRejectedSuggestion')
							cy.get('@firstRow').find(`#${ROW_BUTTON_WITH_ID(salonID || '')}`)
							cy.wait('@deleteRejectedSuggestio').then((interceptionDeleteRejectedSuggestion: any) => {
								// check status code
								expect(interceptionDeleteRejectedSuggestion.response.statusCode).to.equal(200)
								// check conf toast message
								cy.checkSuccessToastMessage()
							})
						})
				})
			} else {
				// check redirect to 403 not allowed page
				cy.location('pathname').should('eq', '/403')
			}
		})
	})
}

export default salonsTestSuite
