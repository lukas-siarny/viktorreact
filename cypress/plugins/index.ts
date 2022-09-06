/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
export default (on: any, config: any) => {
	// eslint-disable-next-line no-param-reassign
	config = {
		...config,
		env: {
			...config.env,
			auth_email: process.env.AUTH_EMAIL,
			auth_password: process.env.AUTH_PASSWORD,
			sign_in_url: process.env.SIGN_IN_URL
		}
	}

	return config
}
