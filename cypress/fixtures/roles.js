import { CRUD_OPERATIONS, LIST_OF_TESTS_SUITS } from '../enums'
import { PERMISSION } from '../../src/utils/enums'

const data = [
	{
		role: PERMISSION.NOTINO_SUPER_ADMIN,
		credentials: {
			user: 'roman.haluska@goodrequest.com',
			password: 'Lopaty123.'
		},
		tests: [
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
				name: LIST_OF_TESTS_SUITS.USER_CRUD,
				actions: [CRUD_OPERATIONS.ALL]
			}
		]
	},
	{
		role: PERMISSION.PARTNER_ADMIN,
		credentials: {
			user: 'test.confirmed_partneruser@goodrequest.com',
			password: 'Lopaty123.'
		},
		tests: [
			{
				name: LIST_OF_TESTS_SUITS.USER_CRUD,
				actions: [CRUD_OPERATIONS.READ]
			}
		]
	}
]

export default data
