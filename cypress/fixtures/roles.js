import { CRUD_OPERATIONS, LIST_OF_TESTS_SUITS } from '../enums'
import { PERMISSION } from '../../src/utils/enums'

const data = [
	{
		role: PERMISSION.NOTINO_SUPER_ADMIN,
		credentials: {
			user: 'lubomir.igonda@goodrequest.com',
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
				name: LIST_OF_TESTS_SUITS.SALON,
				actions: [CRUD_OPERATIONS.ALL]
			}
		],
		isInActive: true
	},
	{
		role: PERMISSION.NOTINO_ADMIN,
		credentials: {
			user: 'test.confirmed_notinouser@goodrequest.com',
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
				name: LIST_OF_TESTS_SUITS.SALON,
				actions: [CRUD_OPERATIONS.ALL]
			}
		],
		isInActive: true
	},
	{
		role: PERMISSION.PARTNER_ADMIN,
		credentials: {
			user: 'test.confirmed_partneruser@goodrequest.com',
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
				name: LIST_OF_TESTS_SUITS.SALON,
				actions: []
			}
		]
	}
]

export default data
