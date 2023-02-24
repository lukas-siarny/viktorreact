import specialistContactsCRUDTestSuit from './specialistContactsCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Specialist contacts', () => {
	specialistContactsCRUDTestSuit([CRUD_OPERATIONS.ALL])
})
