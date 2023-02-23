import categoryParameterCRUDTestSuit from './categoryParametersCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Category parameters', () => {
	categoryParameterCRUDTestSuit([CRUD_OPERATIONS.ALL])
})
