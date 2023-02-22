import cosmeticsTestSuit from './cosmeticsCRUD.tests'

// enums
import { CRUD_OPERATIONS } from '../../enums'

describe('Cosmetics', () => {
	cosmeticsTestSuit([CRUD_OPERATIONS.ALL])
})
