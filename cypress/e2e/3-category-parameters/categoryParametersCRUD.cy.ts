import categoryParameterCRUDTestSuit from './categoryParametersCRUD.test'

import { CRUD_OPERATIONS } from '../../enums'

describe('Category parameters', () => {
	categoryParameterCRUDTestSuit([CRUD_OPERATIONS.ALL])
})
