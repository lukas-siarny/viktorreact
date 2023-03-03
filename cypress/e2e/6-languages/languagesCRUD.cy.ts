import languagesCRUDTestSuite from './languagesCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Languages', () => {
	languagesCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
