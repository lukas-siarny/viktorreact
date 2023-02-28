import { REVIEW_VERIFICATION_STATUS } from '../../../src/utils/enums'

describe('Reviews', () => {
	beforeEach(() => {
		// restore local storage with tokens and salon id from snapshot
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		// take snapshot of local storage with new refresh and access token
		cy.saveLocalStorage()
	})

	context('Update', () => {
		// NOTE: reviews with specifiaed message types must exists in the DB in order to tests work properly!!
		it('Hide published message', () => cy.updateReviewStatus(REVIEW_VERIFICATION_STATUS.VISIBLE_IN_B2C, 'hide'))
		it('Publish hidden message', () => cy.updateReviewStatus(REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C, 'publish'))
		it('Accept not verified message', () => cy.updateReviewStatus(REVIEW_VERIFICATION_STATUS.NOT_VERIFIED, 'accept'))
		it('Hide not verified message', () => cy.updateReviewStatus(REVIEW_VERIFICATION_STATUS.NOT_VERIFIED, 'hide'))
		it('Delete review with published message', () => cy.deleteReview(REVIEW_VERIFICATION_STATUS.VISIBLE_IN_B2C))
	})
})
