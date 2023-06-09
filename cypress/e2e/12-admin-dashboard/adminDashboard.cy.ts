import adminDashboardTestSuite from './adminDashboard.tests'

import { CRUD_OPERATIONS } from '../../enums'
import { PERMISSION } from '../../../src/utils/enums'

describe('Admin dashboard', () => {
	adminDashboardTestSuite([CRUD_OPERATIONS.ALL], PERMISSION.NOTINO_SUPER_ADMIN)
})
