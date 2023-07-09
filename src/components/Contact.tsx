import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import ListDivided from './ListDivided'
import { SECTIONS } from '../utils/enums'

const Contact = () => {
	const { t, i18n } = useTranslation()

	const sections = SECTIONS[i18n.language as keyof typeof SECTIONS]

	return (
		<section className='section-base contact' id={sections.CONTACT}>
			<div className='contact-content container'>
				<h2>{t('loc:Kontakt')}</h2>
				<address>
					<Trans defaults={t('loc:SNP 12<br />Slovenska Lupca 976 13 , Slovensko')} components={{ strong: <strong /> }} />
					<br />
					<br />
					<ListDivided items={[<a href='mailto:kabekovo@gmail.com'>kabekovo@gmail.com</a>, <a href='tel:+421910539872'>+421 910 539 872</a>]} />
				</address>
			</div>
		</section>
	)
}

export default Contact
