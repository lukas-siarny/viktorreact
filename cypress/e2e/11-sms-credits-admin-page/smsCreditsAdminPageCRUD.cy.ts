import smsCreditsAdminPageCRUDTestSuite from './smsCreditsAdminPageCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('SMS unit prices', () => {
	smsCreditsAdminPageCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
