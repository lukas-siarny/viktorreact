import adminReservationsTestSuite from './admin-reservations.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Admin reservations', () => {
	adminReservationsTestSuite([CRUD_OPERATIONS.ALL])
})
