import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import qrTemplateSmall from '../assets/images/qrcode-small-template.png'
import { ReactComponent as DownloadIcon } from '../assets/icons/download-icon.svg'

type Props = {
	link: string
	description: string
}

const QrCode = (props: Props) => {
	const [t] = useTranslation()
	const { link, description } = props

	return (
		<div className={'flex items-center'}>
			<img src={qrTemplateSmall} alt='qr code' className='block' />
			<div className={'flex flex-col'}>
				<h4>{t('loc:Digitálny QR kód')}</h4>
				<span className={'mb-4 text-notino-grayDark'}>{description}</span>
				<div>
					<Button
						className={'noti-btn'}
						// TODO: href
						href={link}
						target='_blank'
						rel='noopener noreferrer'
						type={'primary'}
						htmlType={'button'}
						title='Download file'
						icon={<DownloadIcon width={24} />}
						block
						download
					>
						Stiahnut
					</Button>
				</div>
			</div>
		</div>
	)
}

export default QrCode
