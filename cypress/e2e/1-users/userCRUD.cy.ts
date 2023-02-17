import userCRUDTestSuit from './userCRUD.tests'

// enums
import { CRUD_OPERATIONS } from '../../enums'

context('User', () => {
	userCRUDTestSuit([CRUD_OPERATIONS.ALL])
})
