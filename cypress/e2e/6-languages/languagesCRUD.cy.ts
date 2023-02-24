import languagesCRUDTestSuit from './languagesCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Languages', () => {
	languagesCRUDTestSuit([CRUD_OPERATIONS.ALL])
})
