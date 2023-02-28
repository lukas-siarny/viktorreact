import data from '../../fixtures/roles'

import { LIST_OF_TESTS_SUITS } from '../../enums'

// testSuits
import updateMyAccountTestSuit from '../1-users/updateMyAccountInfo.tests'
import userCRUDTestSuit from '../1-users/userCRUD.tests'
import categoryParameterCRUDTestSuit from '../2-category-parameters/categoryParametersCRUD.tests'
import cosmeticsCRUDTestSuit from '../3-cosmetics/cosmeticsCRUD.tests'
import specialistContactsCRUDTestSuit from '../4-specialist-contacts/specialistContactsCRUD.tests'
import supportCRUDTestSuit from '../5-support/supportCRUD.tests'
import languagesCRUDTestSuit from '../6-languages/languagesCRUD.tests'
import categoriesCRUDTestSuit from '../7-categories/categoriesCRUD.tests'
import salonTestSuit from '../8-salons/salon.tests'

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
					case LIST_OF_TESTS_SUITS.SALON:
						context(`SalonCRUD as ${user.role}`, () => salonTestSuit(test.actions, user.credentials.user, user.credentials.password))
						break
					default:
				}
			})
		}
	})
})
