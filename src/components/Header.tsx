import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ListDivided from './ListDivided'
import { getSections, getWindow } from '../utils/helpers'
import { SECTIONS } from '../utils/enums'

enum SCROLL_DIR {
	UP = 'UP',
	DOWN = 'DOWN'
}

const Header = () => {
	const { t, i18n } = useTranslation()
	const [scrollDir, setScrollDir] = useState<SCROLL_DIR | null>(null)
	const [navIsOpen, setNavIsOpen] = useState(false)

	const sections = SECTIONS[i18n.language as keyof typeof SECTIONS]

	const changeLanguage = (locale: string) => {
		const currentSections = getSections(i18n.language)
		const newSections = getSections(locale)
		i18n.changeLanguage(locale)
		let { hash } = window.location
		hash = hash?.substring(1) // remove #
		if (hash && currentSections && newSections) {
			const key = Object.keys(currentSections)[Object.values(currentSections).indexOf(hash)]
			const newValue = Object.entries(newSections).find(([newKey]) => key === newKey)?.[1]
			hash = newValue
		}
		window.history.pushState('', document.title, hash ? `${window.location.pathname}?lng=${locale}#${hash}` : `${window.location.pathname}?lng=${locale}`)
	}

	useEffect(() => {
		const window = getWindow()

		if (window) {
			const threshold = 0

			let lastScrollY = window.scrollY
			let ticking = false

			const updateScrollDir = () => {
				const { scrollY } = window

				if (Math.abs(scrollY - lastScrollY) < threshold) {
					ticking = false
					return
				}
				setScrollDir(scrollY > lastScrollY && lastScrollY > 0 ? SCROLL_DIR.DOWN : SCROLL_DIR.UP)
				lastScrollY = scrollY > 0 ? scrollY : 0
				ticking = false
			}

			const onScroll = () => {
				if (!ticking && !navIsOpen) {
					window.requestAnimationFrame(updateScrollDir)
					ticking = true
				}
			}

			window.addEventListener('scroll', onScroll)

			return () => window.removeEventListener('scroll', onScroll)
		}
		return () => null
	}, [scrollDir, navIsOpen])

	return (
		<header id='header' className={`${scrollDir === SCROLL_DIR.DOWN && !navIsOpen ? 'header-hidden' : ''} ${navIsOpen ? 'nav-is-open' : ''}`.trim()}>
			<div className='header-content container'>
				<h1 className='logo'>
					<img src='./logo.png' alt='' />
					<div className='logo-text'>
						<div>
							<span>KA-BE</span>
							<span>kovo</span>
							<span>s.r.o.</span>
						</div>
						<span>{t('loc:Umelecké kováčstvo')}</span>
					</div>
				</h1>
				<nav>
					<button className='hamburger' type={'button'} onClick={() => setNavIsOpen(!navIsOpen)}>
						<span className='line' />
					</button>
					<div className='nav-wrapper'>
						<div className='language-switcher'>
							<ul className='list-divided'>
								<ListDivided
									items={[
										<button className='btn-link' type={'button'} onClick={() => changeLanguage('sk')}>
											Sk
										</button>,
										<button className='btn-link' type={'button'} onClick={() => changeLanguage('en')}>
											En
										</button>
									]}
								/>
							</ul>
						</div>
						<div className='main-nav'>
							<ul className='list-divided' id='menu-links'>
								<ListDivided
									items={[
										<a href={`#${sections.ABOUT}`} className='link-light menu-link' onClick={() => setNavIsOpen(false)}>
											{t('loc:O nás')}
										</a>,
										<a href={`#${sections.WORK}`} className='link-light menu-link' onClick={() => setNavIsOpen(false)}>
											{t('loc:Práca')}
										</a>,
										<a href={`#${sections.CONTACT}`} className='link-light menu-link' onClick={() => setNavIsOpen(false)}>
											{t('loc:Kontakt')}
										</a>
									]}
								/>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		</header>
	)
}

export default Header
