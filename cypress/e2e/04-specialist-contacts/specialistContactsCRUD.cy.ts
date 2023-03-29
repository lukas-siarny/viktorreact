import specialistContactsCRUDTestSuite from './specialistContactsCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Specialist contacts', () => {
	specialistContactsCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
