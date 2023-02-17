import cosmeticsTestSuit from './cosmeticsCRD.tests'
import { loginViaApi } from '../../support/e2e'

describe('Cosmetics', () => {
	before(() => {
		loginViaApi()
	})

	cosmeticsTestSuit([])
})
