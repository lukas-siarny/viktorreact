import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, WithTranslation } from 'react-i18next'
import { Result } from 'antd'
import { getPath } from '../../utils/history'

type Props = WithTranslation

const ForbiddenPage: FC<Props> = () => {
	const [t] = useTranslation()
	return (
		<Result
			status='403'
			title={'403'}
			subTitle={t('loc:Na stránku, ktorú sa pokúšate zobraziť, nemáte dostatočné oprávnenia Ak si myslíte, že by ste mali mať prístup, prosím kontaktujte nás')}
			extra={<Link to={getPath(t('paths:index'))}>{t('loc:Hlavná stránka')}</Link>}
		/>
	)
}

export default ForbiddenPage
