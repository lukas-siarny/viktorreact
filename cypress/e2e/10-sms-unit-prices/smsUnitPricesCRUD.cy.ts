import smsUnitPricesCRUDTestSuite from './smsUnitPricesCRUD.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('SMS unit prices', () => {
	smsUnitPricesCRUDTestSuite([CRUD_OPERATIONS.ALL])
})
