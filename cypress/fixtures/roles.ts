import { CRUD_OPERATIONS, LIST_OF_TESTS_SUITS, SALON_TESTS_SUITS } from '../enums'
import { PERMISSION, SALON_ROLES } from '../../src/utils/enums'

// eslint-disable-next-line import/no-cycle
import { ITestConfig } from '../e2e/10-roles/roles.cy'

const data: ITestConfig[] = [
	{
		role: PERMISSION.NOTINO_SUPER_ADMIN,
		credentials: {
			user: 'super.admin@goodrequest.com',
			password: 'Lopaty123.'
		},
		tests: [
			{
				name: LIST_OF_TESTS_SUITS.USER_UPDATE_MY_ACCOUNT,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.USER_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.CATEGORY_PARAMETERS_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.COSMETICS_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.SPECIALIST_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.SUPPORT_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.LANGUAGES_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.CATEGORIES_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.REVIEWS,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.SMS_UNIT_PRICES_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.SALON,
				actions: [CRUD_OPERATIONS.ALL],
				/*
					!!! Do not remove or change the order of tests in this array !!! Change of order
					can cause malfunction of tests, because individual tests are independent of each other
				*/
				tests: [
					{
						name: SALON_TESTS_SUITS.BILLING_INFORMATION,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.CUSTOMER,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.EMPLOYEE,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.INDUSTRIES_AND_SERVICES,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.RESERVATIONS,
						actions: [CRUD_OPERATIONS.ALL]
					}
				]
			}
		],
		isInActive: true
	},
	{
		role: PERMISSION.NOTINO_ADMIN,
		credentials: {
			user: 'notino.admin@goodrequest.com',
			password: 'Lopaty123.'
		},
		tests: [
			{
				name: LIST_OF_TESTS_SUITS.USER_UPDATE_MY_ACCOUNT,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.USER_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.CATEGORY_PARAMETERS_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.COSMETICS_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.SPECIALIST_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.SUPPORT_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.LANGUAGES_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.CATEGORIES_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.SMS_UNIT_PRICES_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			},
			{
				name: LIST_OF_TESTS_SUITS.SALON,
				actions: [CRUD_OPERATIONS.ALL]
			}
		],
		isInActive: true
	},
	{
		// also NOTINO Partner role coverage by this tests
		role: SALON_ROLES.ADMIN,
		credentials: {
			user: 'employee1.admin.salon1@goodrequest.com',
			password: 'Lopaty123.'
		},
		tests: [
			{
				name: LIST_OF_TESTS_SUITS.USER_UPDATE_MY_ACCOUNT,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.USER_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.CATEGORY_PARAMETERS_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.COSMETICS_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.SPECIALIST_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.SUPPORT_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.LANGUAGES_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.CATEGORIES_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.SMS_UNIT_PRICES_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.SALON,
				actions: [CRUD_OPERATIONS.ALL],
				/*
					!!! Do not remove or change the order of tests in this array !!! Change of order
					can cause malfunction of tests, because individual tests are independent of each other
				*/
				tests: [
					{
						name: SALON_TESTS_SUITS.BILLING_INFORMATION,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.CUSTOMER,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.EMPLOYEE,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.INDUSTRIES_AND_SERVICES,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.RESERVATIONS,
						actions: [CRUD_OPERATIONS.ALL]
					}
				]
			}
		]
	},
	{
		role: SALON_ROLES.MANAGER,
		credentials: {
			user: 'employee1.manager.salon2@goodrequest.com',
			password: 'Lopaty123.'
		},
		tests: [
			{
				name: LIST_OF_TESTS_SUITS.USER_UPDATE_MY_ACCOUNT,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.USER_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.CATEGORY_PARAMETERS_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.COSMETICS_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.SPECIALIST_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.SUPPORT_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.LANGUAGES_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.CATEGORIES_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.SMS_UNIT_PRICES_CRUD,
				actions: []
			},
			{
				name: LIST_OF_TESTS_SUITS.SALON,
				actions: [CRUD_OPERATIONS.READ, CRUD_OPERATIONS.UPDATE],
				tests: [
					{
						name: SALON_TESTS_SUITS.BILLING_INFORMATION,
						actions: []
					},
					{
						name: SALON_TESTS_SUITS.CUSTOMER,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.EMPLOYEE,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.INDUSTRIES_AND_SERVICES,
						actions: [CRUD_OPERATIONS.ALL]
					},
					{
						name: SALON_TESTS_SUITS.RESERVATIONS,
						actions: [CRUD_OPERATIONS.ALL]
					}
				]
			}
		]
	}
]

export default data
