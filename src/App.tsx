import React, { Suspense, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'

// utils
import i18n from './utils/i18n'
import About from './components/About'
import Contact from './components/Contact'
import ContactDivider from './components/ContactDivider'
import Gallery from './components/Gallery'
import Header from './components/Header'
import Hero from './components/Hero'

const App = () => {
	useEffect(() => {
		i18n.on('languageChanged', (language) => {
			document.documentElement.setAttribute('lang', language)
		})
	}, [])

	return (
		<Suspense fallback={<div className={'suspense-loading-spinner'}>Loading...</div>}>
			<I18nextProvider i18n={i18n}>
				<Header />
				<Hero />
				<About />
				<ContactDivider />
				<Gallery />
				<Contact />
				<ContactDivider />
			</I18nextProvider>
		</Suspense>
	)
}
export default App
