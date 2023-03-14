// eslint-disable-next-line import/no-cycle
import salonTestSuite from './salon.tests'

import { CRUD_OPERATIONS, SALON_TESTS_SUITS } from '../../enums'

import { ITests } from '../11-roles/roles.cy'
import { PERMISSION } from '../../../src/utils/enums'

const salonSubTests: ITests[] = [
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

describe('Salons', () => {
	// add PERMISSION.NOTINO_SUPER_ADMIN role because default logged user is super admin
	salonTestSuite([CRUD_OPERATIONS.ALL], salonSubTests, PERMISSION.NOTINO_SUPER_ADMIN)
})
