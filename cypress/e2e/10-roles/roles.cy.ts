// eslint-disable-next-line import/no-cycle
import data from '../../fixtures/roles'

import { CRUD_OPERATIONS, LIST_OF_TESTS_SUITS, SALON_TESTS_SUITS } from '../../enums'
import { PERMISSION, SALON_ROLES } from '../../../src/utils/enums'

// testSuits
import updateMyAccountTestSuite from '../1-users/updateMyAccountInfo.tests'
import userCRUDTestSuite from '../1-users/userCRUD.tests'
import categoryParameterCRUDTestSuite from '../2-category-parameters/categoryParametersCRUD.tests'
import cosmeticsCRUDTestSuite from '../3-cosmetics/cosmeticsCRUD.tests'
import specialistContactsCRUDTestSuite from '../4-specialist-contacts/specialistContactsCRUD.tests'
import supportCRUDTestSuite from '../5-support/supportCRUD.tests'
import languagesCRUDTestSuite from '../6-languages/languagesCRUD.tests'
import categoriesCRUDTestSuite from '../7-categories/categoriesCRUD.tests'
// eslint-disable-next-line import/no-cycle
import salonTestSuite from '../8-salons/salon.tests'
import reviewsTestSuite from '../9-reviews/reviews.tests'

export declare interface ITests {
	name: SALON_TESTS_SUITS | LIST_OF_TESTS_SUITS
	actions: CRUD_OPERATIONS[]
	tests?: ITests[]
}

export declare interface ITestConfig {
	role: PERMISSION | SALON_ROLES
	credentials: {
		user: string
		password: string
	}
	tests: ITests[]
	isInActive?: boolean
}

describe('Dynamic tests for roles', () => {
	data.forEach((user) => {
		if (!user.isInActive) {
			user.tests.forEach((test) => {
				switch (test.name) {
					case LIST_OF_TESTS_SUITS.USER_UPDATE_MY_ACCOUNT:
						context(`MyAccountUpdate as ${user.role}`, () => updateMyAccountTestSuite(user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.USER_CRUD:
						context(`UserCRUD as ${user.role}`, () => userCRUDTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.CATEGORY_PARAMETERS_CRUD:
						context(`CategoryParametersCRUD as ${user.role}`, () => categoryParameterCRUDTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.COSMETICS_CRUD:
						context(`CosmeticsCRUD as ${user.role}`, () => cosmeticsCRUDTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.SPECIALIST_CRUD:
						context(`SpecialistContactsCRUD as ${user.role}`, () => specialistContactsCRUDTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.SUPPORT_CRUD:
						context(`SupportCRUD as ${user.role}`, () => supportCRUDTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.LANGUAGES_CRUD:
						context(`LanguagesCRUD as ${user.role}`, () => languagesCRUDTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.CATEGORIES_CRUD:
						context(`CategoriesCRUD as ${user.role}`, () => categoriesCRUDTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.SALON:
						context(`SalonCRUD as ${user.role}`, () => salonTestSuite(test.actions, test.tests || [], user.role, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.REVIEWS:
						context(`ReviewsCRUD as ${user.role}`, () => reviewsTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					default:
				}
			})
		}
	})
})
