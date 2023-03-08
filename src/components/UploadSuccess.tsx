import React from 'react'
import { Alert, Button } from 'antd'
import { useTranslation } from 'react-i18next'

// assets
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'
import { ReactComponent as CheckIcon } from '../assets/icons/check-icon-success.svg'

type Props = {
	onUploadAgain: () => void
}

const UploadSuccess = (props: Props) => {
	const { onUploadAgain } = props
	const [t] = useTranslation()

	return (
		<div className={'data-upload-success flex items-center gap-4 flex-col'}>
			<Alert
				message={t('loc:Požiadavka na spracovanie dát bola úspešne vytvorená.')}
				type={'success'}
				className={'noti-alert success-upload-alert'}
				showIcon
				icon={<CheckIcon />}
			/>
			<p className={'mb-0'}>{t('loc:Po spracovaní vám na vašu e-mailovú adresu zašleme súhrnnú správu o importe.')}</p>
			<Button onClick={onUploadAgain} type='primary' htmlType='button' className={'noti-btn'} icon={<UploadIcon />}>
				{t('loc:Importovať ďalšie')}
			</Button>
		</div>
	)
}

export default UploadSuccess
