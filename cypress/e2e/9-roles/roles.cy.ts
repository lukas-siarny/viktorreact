import data from '../../fixtures/roles'

// testSuits
import userCRUDTestSuit from '../1-users/userCRUD.tests'
import cosmeticsTestSuit from '../4-cosmetics/cosmeticsCRUD.tests'

// enums
import { LIST_OF_TESTS_SUITS } from '../../enums'
import updateMyAccountTestSuit from '../1-users/updateMyAccountInfo.tests'

describe('Dynamic tests for roles', () => {
	data.forEach((user) => {
		if (!user.isInActive) {
			user.tests.forEach((test) => {
				if (test.name === LIST_OF_TESTS_SUITS.USER_UPDATE_MY_ACCOUNT) {
					context(`MyAccountUpdate as ${user.role}`, () => updateMyAccountTestSuit(user.credentials.user, user.credentials.password))
				}
				if (test.name === LIST_OF_TESTS_SUITS.USER_CRUD) {
					context(`UserCRUD as ${user.role}`, () => userCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
				}
				if (test.name === LIST_OF_TESTS_SUITS.COSMETICS_CRUD) {
					context(`CosmeticsCRUD as ${user.role}`, () => cosmeticsTestSuit(test.actions, user.credentials.user, user.credentials.password))
				}
			})
		}
	})
})
