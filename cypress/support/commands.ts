import 'cypress-localstorage-commands'
import 'cypress-file-upload'

Cypress.Commands.add('apiAuth', (email: string, password: string) => {
	cy.log(`Login as ${email}`)
	cy.request({
		method: 'POST',
		url: '/api/b2b/admin/auth/login',
		body: {
			email: email,
			password: password,
		},
	}).then(({ body }) => {
		window.localStorage.setItem('access_token', body.accessToken)
		window.localStorage.setItem('refresh_token', body.refreshToken)
		cy.saveLocalStorage()
	})
})
