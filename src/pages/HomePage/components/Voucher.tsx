import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'
import { ReactComponent as VoucherIcon } from '../../../assets/images/voucher.svg'
import { ReactComponent as CopyableIcon } from '../../../assets/icons/copyable-icon.svg'
import { ReactComponent as CheckIcon } from '../../../assets/icons/checkbox-checked-icon-16.svg'

type Props = {
	code?: string | null
}
const { Paragraph } = Typography
const Voucher = ({ code }: Props) => {
	const [t] = useTranslation()
	return code ? (
		<div style={{ marginLeft: '-5px' }} className={'relative'}>
			<VoucherIcon />
			<div className={'absolute top-[30px] left-[82px]'}>
				<div className={'text-lg text-black font-bold'}>{t('loc:Notino kupón')}</div>
				<Paragraph
					className={'flex text-notino-grayDarker text-xs m-0'}
					copyable={{
						text: code,
						icon: [<CopyableIcon className={'text-notino-pink hover:text-notino-pink'} />, <CheckIcon className={'text-notino-pink hover:text-notino-pink'} />]
					}}
				>
					{code}
				</Paragraph>
			</div>
		</div>
	) : null
}

export default Voucher
