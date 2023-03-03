import { REVIEW_VERIFICATION_STATUS, REVIEWS_TAB_KEYS } from '../../../src/utils/enums'
import { CRUD_OPERATIONS } from '../../enums'

import { loginViaApi } from '../../support/e2e'

const updateReviewStatus = (currentStatus: REVIEW_VERIFICATION_STATUS, moderateItemKey: 'hide' | 'publish' | 'accept', testDesc: string, actions: CRUD_OPERATIONS[]) => {
	it(testDesc, () => {
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
}

const deleteReview = (currentStatus: REVIEW_VERIFICATION_STATUS, testDesc: string, actions: CRUD_OPERATIONS[]) => {
	it(testDesc, () => {
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
}

const reviewsTestSuite = (actions: CRUD_OPERATIONS[], email?: string, password?: string): void => {
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

	context('Review', () => {
		// NOTE: reviews with specified message types must exist in the DB in order to tests work properly!!
		updateReviewStatus(REVIEW_VERIFICATION_STATUS.VISIBLE_IN_B2C, 'hide', 'Hide published message', actions)
		updateReviewStatus(REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C, 'publish', 'Publish hidden message', actions)
		updateReviewStatus(REVIEW_VERIFICATION_STATUS.NOT_VERIFIED, 'accept', 'Accept not verified message', actions)
		updateReviewStatus(REVIEW_VERIFICATION_STATUS.NOT_VERIFIED, 'hide', 'Hide not verified message', actions)
		deleteReview(REVIEW_VERIFICATION_STATUS.VISIBLE_IN_B2C, 'Delete review with published message', actions)
	})
}

export default reviewsTestSuite
