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
			}
		]
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
				actions: [CRUD_OPERATIONS.READ]
			}
		]
	}
]

// { name: CRUD_OPERATIONS.READ, result: OPERATION_RESULT.FAILED }

export default data
