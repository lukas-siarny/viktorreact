import salonTestSuit from './salon.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Salons', () => {
	salonTestSuit([CRUD_OPERATIONS.ALL])
})
