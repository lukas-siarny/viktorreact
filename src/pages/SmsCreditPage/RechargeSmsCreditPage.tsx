import React, { useEffect, FC } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { isSubmitting } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Row, Spin } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

// redux
import { RootState } from '../../reducers'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import RechargeSmsCreditForm from './components/RechargeSmsCreditForm'

// utils
import { PERMISSION, FORM, D_M_YEAR_FORMAT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { postReq } from '../../utils/request'

// types
import { IBreadcrumbs, IRechargeSmsCreditForm, SalonSubPageProps } from '../../types/interfaces'

// assets
import { ReactComponent as CoinsIcon } from '../../assets/icons/coins.svg'

// redux
import { getWallet } from '../../reducers/wallet/walletActions'
import { getSmsUnitPrice } from '../../reducers/smsUnitPrices/smsUnitPricesActions'
import { getSmsStats } from '../../reducers/sms/smsActions'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

const RechargeSmsCreditPage: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const submitting = useSelector(isSubmitting(FORM.RECHARGE_SMS_CREDIT))
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const walletID = selectedSalon?.data?.wallet?.id

	// const wallet = useSelector((state: RootState) => state.wallet.wallet)

	const smsPriceUnit = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPrice)
	const stats = useSelector((state: RootState) => state.sms.stats)

	const isLoading = submitting || smsPriceUnit.isLoading || selectedSalon.isLoading || stats.isLoading

	const validFrom = smsPriceUnit?.data?.validFrom
	const validPriceLabel = validFrom ? t('loc:Aktuálna cena SMS platná od {{ validFrom }}', { validFrom: dayjs(validFrom).format(D_M_YEAR_FORMAT) }) : t('loc:Aktuálna cena SMS')

	const [backUrl] = useBackUrl(parentPath + t('paths:sms-credit'))

	useEffect(() => {
		;(async () => {
			const { data } = await dispatch(getSmsStats(salonID))
			const priceId = data?.currentSmsUnitPrice.id
			if (priceId) {
				dispatch(getSmsUnitPrice(priceId))
			}
		})()
	}, [dispatch, salonID])

	const handleRechargeCredit = async (values: IRechargeSmsCreditForm) => {
		if (!walletID || !selectedSalon.data?.currency.code) {
			return
		}
		try {
			await postReq(
				'/api/b2b/admin/wallets/transactions',
				{},
				{
					amount: values.amount,
					currencyCode: selectedSalon.data?.currency.code,
					transactionNote: values.transactionNote || null,
					walletIDs: [walletID]
				}
			)
			if (backUrl) {
				navigate(backUrl)
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:SMS kredit'),
				link: backUrl
			},
			{
				name: t('loc:Dobiť kredit')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:customers')} />
			</Row>
			<div className='content-body small'>
				<Spin spinning={isLoading}>
					<Col className={'flex'}>
						<Row className={'mx-9 w-full h-full block'} justify='center'>
							<h3 className={'mb-0 mt-0 flex items-center'}>
								<CoinsIcon className={'text-notino-black mr-2'} /> {t('loc:Dobiť kredit')}
							</h3>
							<Divider className={'mb-3 mt-3'} />
							<ul className={'list-none p-0 m-0 mb-8'}>
								<li className={'flex justify-between gap-2 mb-2'}>
									<strong>{t('loc:Salón')}:</strong> {selectedSalon.data?.name}
								</li>
								<li className={'flex justify-between gap-2'}>
									<strong>{validPriceLabel}:</strong>
									{stats.data?.currentSmsUnitPrice.formattedAmount}
								</li>
							</ul>
							<RechargeSmsCreditForm onSubmit={handleRechargeCredit} currencySymbol={selectedSalon.data?.currency.symbol} />
						</Row>
					</Col>
				</Spin>
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO]))(RechargeSmsCreditPage)
