import data from '../../fixtures/roles'

import { LIST_OF_TESTS_SUITS } from '../../enums'

// testSuits
import updateMyAccountTestSuit from '../1-users/updateMyAccountInfo.tests'
import userCRUDTestSuit from '../1-users/userCRUD.tests'
import salonTestSuit from '../2-salons/salon.tests'
import categoryParameterCRUDTestSuit from '../3-category-parameters/categoryParametersCRUD.test'
import cosmeticsCRUDTestSuit from '../4-cosmetics/cosmeticsCRUD.tests'
import specialistContactsCRUDTestSuit from '../5-specialist-contacts/specialistContactsCRUD.tests'
import supportCRUDTestSuit from '../6-support/supportCRUD.tests'
import languagesCRUDTestSuit from '../7-languages/languagesCRUD.tests'
import categoriesCRUDTestSuit from '../8-categories/categoriesCRUD.tests'

describe('Dynamic tests for roles', () => {
	data.forEach((user) => {
		if (!user.isInActive) {
			user.tests.forEach((test) => {
				switch (test.name) {
					case LIST_OF_TESTS_SUITS.USER_UPDATE_MY_ACCOUNT:
						context(`MyAccountUpdate as ${user.role}`, () => updateMyAccountTestSuit(user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.USER_CRUD:
						context(`UserCRUD as ${user.role}`, () => userCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.SALON:
						context(`SalonCRUD as ${user.role}`, () => salonTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.CATEGORY_PARAMETERS_CRUD:
						context(`CategoryParametersCRUD as ${user.role}`, () => categoryParameterCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.COSMETICS_CRUD:
						context(`CosmeticsCRUD as ${user.role}`, () => cosmeticsCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.SPECIALIST_CRUD:
						context(`SpecialistContactsCRUD as ${user.role}`, () => specialistContactsCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.SUPPORT_CRUD:
						context(`SupportCRUD as ${user.role}`, () => supportCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.LANGUAGES_CRUD:
						context(`LanguagesCRUD as ${user.role}`, () => languagesCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.CATEGORIES_CRUD:
						context(`CategoriesCRUD as ${user.role}`, () => categoriesCRUDTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					default:
				}
			})
		}
	})
})
