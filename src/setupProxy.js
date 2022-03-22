/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware')
// manualy set proxy server cause this issue https://github.com/facebook/create-react-app/issues/6720
module.exports = (app) => {
	app.use(
		createProxyMiddleware('/api', {
			target: 'https://notino-development.goodrequest.dev',
			changeOrigin: true
		})
	)

	app.use('/', (req, res, next) => {
		if (req.url === '/') {
			return res.redirect('/b2b')
		}
		return next()
	})
}
