import data from '../../fixtures/roles'

// testSuits
import userCRUDTestSuit from '../1-users/userCRUD.tests'
import cosmeticsTestSuit from '../4-cosmetics/cosmeticsCRD.tests'

// enums
import { LIST_OF_TESTS_SUITS } from '../../enums'

describe('Dynamic tests for roles', () => {
	data.forEach((user) => {
		if (!user.isInActive) {
			user.tests.forEach((test) => {
				if (test.name === LIST_OF_TESTS_SUITS.USER_CRUD) {
					// cy.log('user: ', user.credentials.user)
					// cy.log('password: ', user.credentials.password)
					context(`UserCRUD as ${user.role}`, () => userCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
				}
			})
		}
	})
})
