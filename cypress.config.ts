import { defineConfig } from 'cypress'
import _ from 'lodash'
import del from 'del'

export default defineConfig({
  projectId: 'notino-b2b-admin',
  scrollBehavior: 'center',
  viewportWidth: 1920,
  viewportHeight: 1080,
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 2
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents: (on, config) => {
		require('cypress-localstorage-commands/plugin')(on, config)
		require('./cypress/plugins/index.ts').default(on, config)
		require('@cypress/code-coverage/task')(on, config),
		on('after:spec', (spec, results) => {
			if (results && results.video) {
			  // Do we have failures for any retry attempts?
			  const failures = _.some(results.tests, (test) => {
				return _.some(test.attempts, { state: 'failed' })
			  })
			  if (!failures) {
				// delete the video if the spec passed and no tests retried
				return del(results.video)
			  }
			}
		  })
		return config
    },
	env: {
		auth_email: process.env.AUTH_EMAIL,
		auth_password: process.env.AUTH_PASSWORD,
		sign_in_url: process.env.SIGN_IN_URL
	},
	experimentalRunAllSpecs: true,
	baseUrl: 'http://localhost:80',
	defaultCommandTimeout: 4000
  },
})
