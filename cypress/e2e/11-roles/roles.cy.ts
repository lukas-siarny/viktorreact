// eslint-disable-next-line import/no-cycle
import data from '../../fixtures/roles'

import { CRUD_OPERATIONS, LIST_OF_TESTS_SUITS, SALON_TESTS_SUITS } from '../../enums'
import { PERMISSION, SALON_ROLES } from '../../../src/utils/enums'

// testSuits
import updateMyAccountTestSuite from '../01-users/updateMyAccountInfo.tests'
import userCRUDTestSuite from '../01-users/userCRUD.tests'
import categoryParameterCRUDTestSuite from '../02-category-parameters/categoryParametersCRUD.tests'
import cosmeticsCRUDTestSuite from '../03-cosmetics/cosmeticsCRUD.tests'
import specialistContactsCRUDTestSuite from '../04-specialist-contacts/specialistContactsCRUD.tests'
import supportCRUDTestSuite from '../05-support/supportCRUD.tests'
import languagesCRUDTestSuite from '../06-languages/languagesCRUD.tests'
import categoriesCRUDTestSuite from '../07-categories/categoriesCRUD.tests'
// eslint-disable-next-line import/no-cycle
import salonTestSuite from '../08-salons/salon.tests'
import salonsTestSuite from '../08-salons/salons.tests'
import reviewsTestSuite from '../09-reviews/reviews.tests'
import smsCreditsAdminPageCRUDTestSuite from '../10-sms-credits-admin-page/smsCreditsAdminPageCRUD.tests'

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
					case LIST_OF_TESTS_SUITS.SALONS:
						context(`SalonCRUD as ${user.role}`, () => salonsTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.REVIEWS:
						context(`ReviewsCRUD as ${user.role}`, () => reviewsTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.ADMIN_RESERVATIONS:
						context(`Admin reservations as ${user.role}`, () => reviewsTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					case LIST_OF_TESTS_SUITS.SMS_UNIT_PRICES_CRUD:
						context(`SMSUnitPricesCRUD as ${user.role}`, () => smsCreditsAdminPageCRUDTestSuite(test.actions, user.credentials.user, user.credentials.password))
						break
					default:
				}
			})
		}
	})
})
