import { data } from '../../fixtures/roles.json'

context('dynamic test for roles', () => {
	data.forEach((user) => {
		if (user.test.includes('1')) {
			it('test 1', () => {
				cy.log('user: ', user.credentials.user)
				cy.log('password: ', user.credentials.password)
			})
		}
		if (user.test.includes('2')) {
			it('test 2', () => {
				cy.log('user: ', user.credentials.user)
				cy.log('password: ', user.credentials.password)
			})
		}

		if (user.test.includes('3')) {
			it('test 3', () => {
				cy.log('user: ', user.credentials.user)
				cy.log('password: ', user.credentials.password)
			})
		}

		if (user.test.includes('4')) {
			it('test 4', () => {
				cy.log('user: ', user.credentials.user)
				cy.log('password: ', user.credentials.password)
			})
		}
	})
})
