import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'hcowar',
  scrollBehavior: 'center',
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents: (on, config) => {
		require('cypress-localstorage-commands/plugin')(on, config)
		require('./cypress/plugins/index.ts').default(on, config)
		return config
    },
	env: {
		auth_email: process.env.AUTH_EMAIL,
		auth_password: process.env.AUTH_PASSWORD,
		sign_in_url: process.env.SIGN_IN_URL
	},
	experimentalRunAllSpecs: true,
	baseUrl: 'http://localhost:80',
  },
})
