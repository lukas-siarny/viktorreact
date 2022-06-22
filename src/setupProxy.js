/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware')
// manualy set proxy server cause this issue https://github.com/facebook/create-react-app/issues/6720
module.exports = (app) => {
	app.use(
		createProxyMiddleware('/api', {
			target: process.env.PROXY ?? 'https://notino-development.goodrequest.dev',
			changeOrigin: true
		})
	)
}
