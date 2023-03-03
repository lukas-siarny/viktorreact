import supportCRUDTestSuite from './supportCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Support contacts', () => {
	supportCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
