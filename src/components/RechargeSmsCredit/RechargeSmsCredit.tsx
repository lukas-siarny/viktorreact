import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { isSubmitting } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Row, Spin } from 'antd'

// components
import RechargeSmsCreditForm from './components/RechargeSmsCreditForm'

// types
import { IRechargeSmsCreditForm } from '../../types/interfaces'

// assets
import { ReactComponent as CoinsIcon } from '../../assets/icons/coins.svg'

// utils
import { FORM } from '../../utils/enums'

type Props = {
	handleRechargeCredit: (values: IRechargeSmsCreditForm) => void
	description?: React.ReactNode
	currencySymbol: string
	loading?: boolean
}

const RechargeSmsCredit: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleRechargeCredit, currencySymbol, loading, description } = props

	const submitting = useSelector(isSubmitting(FORM.RECHARGE_SMS_CREDIT))

	const isLoading = submitting || loading

	return (
		<div className='content-body small'>
			<Spin spinning={isLoading}>
				<Col className={'flex'}>
					<Row className={'mx-9 w-full h-full block'} justify='center'>
						<h3 className={'mb-0 mt-0 flex items-center'}>
							<CoinsIcon className={'text-notino-black mr-2'} /> {t('loc:Dobiť kredit')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						{description}
						<RechargeSmsCreditForm onSubmit={handleRechargeCredit} currencySymbol={currencySymbol} />
					</Row>
				</Col>
			</Spin>
		</div>
	)
}

export default RechargeSmsCredit
