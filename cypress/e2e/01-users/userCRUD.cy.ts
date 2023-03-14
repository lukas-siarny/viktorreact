import userCRUDTestSuite from './userCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

context('User', () => {
	userCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
