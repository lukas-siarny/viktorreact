import categoryParameterCRUDTestSuite from './categoryParametersCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Category parameters', () => {
	categoryParameterCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
