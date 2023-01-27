// use Nodemailer to get an Ethereal email inbox
// https://nodemailer.com/about/
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-import-module-exports
import nodemailer from 'nodemailer'
// used to fetch emails from the inbox via imap protocol
// eslint-disable-next-line @typescript-eslint/no-var-requires

// used to parse emails from the inbox
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-import-module-exports
import { simpleParser } from 'mailparser'

// eslint-disable-next-line import/no-import-module-exports,import/no-extraneous-dependencies
import { ImapFlow } from 'imapflow'

const makeEmailAccount = async () => {
	// Generate a new Ethereal email inbox account
	const testAccount = await nodemailer.createTestAccount()

	console.log('created new email account %s', testAccount.user)
	console.log('for debugging, the password is %s', testAccount.pass)

	const userEmail = {
		user: {
			email: testAccount.user,
			pass: testAccount.pass
		},

		/**
		 * Utility method for getting the last email
		 * for the Ethereal email account using ImapFlow.
		 */
		async getLastEmail() {
			// Create imap client to connect later to the ethereal inbox and retrieve emails using ImapFlow
			const client = new ImapFlow({
				host: 'ethereal.email',
				port: 993,
				secure: true,
				auth: {
					user: testAccount.user,
					pass: testAccount.pass
				}
			})
			// Wait until client connects and authorizes
			await client.connect()

			let message

			// Select and lock a mailbox. Throws if mailbox does not exist
			const lock = await client.getMailboxLock('INBOX')
			try {
				// fetch latest message source
				// client.mailbox includes information about currently selected mailbox
				// "exists" value is also the largest sequence number available in the mailbox
				message = await client.fetchOne(client.mailbox.exists, { source: true })
				console.log('The message: %s', message.source.toString())

				// list subjects for all messages
				// uid value is always included in FETCH response, envelope strings are in unicode.
				// eslint-disable-next-line no-restricted-syntax
				for await (const res of client.fetch('1:*', { envelope: true })) {
					console.log(`${res.uid}: ${res.envelope.subject}`)
				}
			} finally {
				// Make sure lock is released, otherwise next `getMailboxLock()` never returns
				lock.release()
			}

			// log out and close connection
			await client.logout()

			const mail = await simpleParser(message.source)
			console.log(mail.subject)
			console.log(mail.text)

			// and returns the main fields + attachments array
			return {
				subject: mail.subject,
				text: mail.text,
				html: mail.html,
				attachments: mail.attachments
			}
		}
	}
	return userEmail
}

module.exports = makeEmailAccount
