import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Spin } from 'antd'

// assets
import { ReactComponent as AttachIcon } from '../../../assets/icons/attach-icon.svg'
import { formatDateByLocale } from '../../../utils/helper'
import { MyDocumentDetail } from '../../../types/interfaces'

type Props = {
	data: MyDocumentDetail
	isLoading?: boolean
}

const MyDocumentPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { data, isLoading } = props

	return (
		<Spin spinning={isLoading}>
			<div className='content-body medium'>
				<h4 className={'text-notino-black text-lg mb-6'}>{data.name}</h4>
				{/* <p className={'text-notino-grayDarker'}>
					Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an
					unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
					typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
					recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
				</p> */}
				<p className={'text-notino-grayDarker mb-6'}>
					{t('loc:Platnosť od')}: {formatDateByLocale(data.createdAt)}
				</p>
				<div className={'border-t border-t-notino-grayLight pt-4 flex flex-col items-start'} style={{ borderTopStyle: 'solid' }}>
					{data.files.map((file) => {
						return (
							<a
								key={file.id}
								href={file.original}
								target='_blank'
								rel='noreferrer'
								className={'text-notino-pink hover:text-notino-black inline-flex items-center gap-2'}
							>
								<AttachIcon className={'flex-shrink-0 text-notino-black'} />
								{file.fileName}
							</a>
						)
					})}
				</div>
			</div>
		</Spin>
	)
}

export default MyDocumentPage
