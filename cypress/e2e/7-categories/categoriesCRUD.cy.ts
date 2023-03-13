import categoriesCRUDTestSuite from './categoriesCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Categories', () => {
	categoriesCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
