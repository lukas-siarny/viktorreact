import data from '../../fixtures/roles'

import { LIST_OF_TESTS_SUITS } from '../../enums'

// testSuits
import updateMyAccountTestSuit from '../1-users/updateMyAccountInfo.tests'
import userCRUDTestSuit from '../1-users/userCRUD.tests'
import cosmeticsCRUDTestSuit from '../4-cosmetics/cosmeticsCRUD.tests'
import specialistContactsCRUDTestSuit from '../5-specialist-contacts/specialistContactsCRUD.tests'
import categoriesCRUDTestSuit from '../8-categories/categoriesCRUD.tests'

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
					context(`CosmeticsCRUD as ${user.role}`, () => cosmeticsCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
				}
				if (test.name === LIST_OF_TESTS_SUITS.SPECIALIST_CRUD) {
					context(`SpecialistContactsCRUD as ${user.role}`, () => specialistContactsCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
				}
				if (test.name === LIST_OF_TESTS_SUITS.CATEGORIES_CRUD) {
					context(`CategoriesCRUD as ${user.role}`, () => categoriesCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
				}
			})
		}
	})
})
