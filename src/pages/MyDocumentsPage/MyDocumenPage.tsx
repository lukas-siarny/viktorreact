import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Spin } from 'antd'

// types
import { IBreadcrumbs } from '../../types/interfaces'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// assets
import { ReactComponent as AttachIcon } from '../../assets/icons/attach-icon.svg'
import { formatDateByLocale } from '../../utils/helper'

const MyDocumentPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const isLoading = false

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Dokumenty'),
				link: t('paths:my-documents')
			},
			{
				name: 'Názov dokumentu'
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:my-documents')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body medium'>
					<h4 className={'text-notino-black text-lg mb-6'}>{'Nazov suboru'}</h4>
					<p className={'text-notino-grayDarker'}>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
						electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
						passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
					</p>
					<p className={'text-notino-grayDarker mb-6'}>
						{t('loc:Platnosť od')}: {formatDateByLocale(new Date())}
					</p>
					<div className={'border-t border-t-notino-grayLight pt-4'} style={{ borderTopStyle: 'solid' }}>
						<a href={'link'} target='_blank' rel='noreferrer' className={'text-notino-pink hover:text-notino-black flex items-center gap-2'}>
							<AttachIcon className={'flex-shrink-0 text-notino-black'} />
							{'Nazov dokumentu.pdf'}
						</a>
					</div>
				</div>
			</Spin>
		</>
	)
}

export default MyDocumentPage
