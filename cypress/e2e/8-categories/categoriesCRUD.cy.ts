import categoriesCRUDTestSuit from './categoriesCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Categories', () => {
	categoriesCRUDTestSuit([CRUD_OPERATIONS.ALL])
})
