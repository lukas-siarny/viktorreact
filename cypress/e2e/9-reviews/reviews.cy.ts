import reviewsTestSuite from './reviews.tests'

import { CRUD_OPERATIONS } from '../../enums'

describe('Reviews', () => {
	reviewsTestSuite([CRUD_OPERATIONS.ALL])
})
