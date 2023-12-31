import React, { Suspense, useEffect, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// utils
import i18n from './utils/i18n'
import About from './components/About'
import Contact from './components/Contact'
import ContactDivider from './components/ContactDivider'
import Gallery from './components/Gallery'
import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'

const App = () => {
	const appInit = useRef(true)

	useEffect(() => {
		// set html document lng on language change
		i18n.on('languageChanged', (language) => {
			document.documentElement.setAttribute('lang', language)
		})

		// change language based on url on page load
		if (window.location.search.includes('lng=en')) {
			i18n.changeLanguage('en')
		}

		// scroll to anchor on page load
		let timeOut: NodeJS.Timeout | undefined

		window.location.hash = window.decodeURIComponent(window.location.hash)
		const scrollToAnchor = () => {
			const hashParts = window.location.hash.split('#')

			if (hashParts.length > 1 && appInit.current) {
				appInit.current = false

				const hash = hashParts.slice(-1)[0]
				timeOut = setTimeout(() => {
					document.querySelector(`#${hash}`)?.scrollIntoView()
				}, 100)
			}
		}
		scrollToAnchor()
		window.onhashchange = scrollToAnchor

		return () => clearTimeout(timeOut)
	}, [])

	return (
		<Suspense fallback={<div className={'suspense-loading-spinner'}>Loading...</div>}>
			<I18nextProvider i18n={i18n}>
				<ToastContainer
					position='bottom-right'
					autoClose={false}
					hideProgressBar
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable={false}
					pauseOnHover
					theme='dark'
				/>
				<Header />
				<Hero />
				<About />
				<ContactDivider />
				<Gallery />
				<Contact />
				<Footer />
			</I18nextProvider>
		</Suspense>
	)
}
export default App
