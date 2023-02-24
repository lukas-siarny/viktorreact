import supportCRUDTestSuit from './supportCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Support contacts', () => {
	supportCRUDTestSuit([CRUD_OPERATIONS.ALL])
})
