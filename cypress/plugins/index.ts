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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require('smtp-tester')
/**
 * @type {Cypress.PluginConfig}
 */
export default (on: any, config: any) => {
	// starts the SMTP server at localhost:7777
	const port = 7777
	const mailServer = ms.init(port)
	console.log('mail server at port %d', port)
	// process all emails
	mailServer.bind((addr: string, id: string, email: string) => {
		console.log('--- email ---')
		// TODO: figure out how it would be possible use received emails
		console.log(addr, id, email)
	})
	return config
}
