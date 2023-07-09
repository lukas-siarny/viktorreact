import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

const Quote = () => {
	const { t } = useTranslation()

	return (
		<div className='quote'>
			<blockquote>
				<Trans defaults={t('loc:<q>Majte svoj <strong>originál</strong> - zakliaty oheň v železe</q>')} components={{ strong: <strong />, q: <q /> }} />
			</blockquote>
			<p>{t('loc:Ján Priesol')}</p>
		</div>
	)
}

export default Quote
