import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Result } from 'antd'

type Props = {}

const NotFoundPage: FC<Props> = () => {
	const [t] = useTranslation()
	return (
		<Result
			status='404'
			title='404'
			subTitle={t(
				'loc:Stránka, ktorú sa pokúšate zobraziť, neexistuje Prosím prejdite späť na hlavnú stránku Ak si myslíte, že je to spôsobené chybou aplikácie, prosím kontaktujte nás'
			)}
			extra={<Link to={t('paths:index') as string}>{t('loc:Hlavná stránka')}</Link>}
		/>
	)
}

export default NotFoundPage
