import cosmeticsCRUDTestSuite from './cosmeticsCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Cosmetics', () => {
	cosmeticsCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
