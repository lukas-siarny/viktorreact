import React, { useEffect, FC } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { isSubmitting } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Row, Spin } from 'antd'

// redux
import { RootState } from '../../reducers'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import RechargeSmsCreditForm from './components/RechargeSmsCreditForm'

// utils
import { PERMISSION, FORM } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { postReq } from '../../utils/request'

// types
import { IBreadcrumbs, IRechargeSmsCreditForm, SalonSubPageProps } from '../../types/interfaces'

// assets
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg'

// redux
import { getWallet } from '../../reducers/wallet/walletActions'

// components

const RechargeSmsCreditPage: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath } = props
	const walletID = useSelector((state: RootState) => state.selectedSalon.selectedSalon)?.data?.wallet?.id
	const submitting = useSelector(isSubmitting(FORM.RECHARGE_SMS_CREDIT))

	const [t] = useTranslation()
	const dispatch = useDispatch()

	const isLoading = submitting

	const wallet = useSelector((state: RootState) => state.wallet.wallet)

	useEffect(() => {
		if (!walletID) {
			return
		}
		dispatch(getWallet(salonID, walletID))
	}, [dispatch, salonID, walletID])

	const handleRechargeCredit = async (values: IRechargeSmsCreditForm) => {
		if (!walletID || !wallet.data || submitting) {
			return
		}
		try {
			await postReq(
				'/api/b2b/admin/wallets/transactions',
				{},
				{
					amount: values.amount,
					currencyCode: wallet.data.wallet.currency.code,
					transactionNote: values.transactionNote || null,
					walletIDs: [walletID]
				}
			)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:SMS kredit')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:customers')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body small'>
					<RechargeSmsCreditForm onSubmit={handleRechargeCredit} />
				</div>
			</Spin>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(RechargeSmsCreditPage)
