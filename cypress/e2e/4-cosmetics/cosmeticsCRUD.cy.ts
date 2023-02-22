import cosmeticsCRUDTestSuit from './cosmeticsCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Cosmetics', () => {
	cosmeticsCRUDTestSuit([CRUD_OPERATIONS.ALL])
})
