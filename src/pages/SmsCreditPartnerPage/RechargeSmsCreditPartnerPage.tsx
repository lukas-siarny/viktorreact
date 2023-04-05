import React, { useEffect, FC } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { isSubmitting } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Row } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Alert from '../../components/Dashboards/Alert'

// utils
import { PERMISSION, FORM, D_M_YEAR_FORMAT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { postReq } from '../../utils/request'

// types
import { IBreadcrumbs, IRechargeSmsCreditForm, SalonSubPageProps } from '../../types/interfaces'
import { RootState } from '../../reducers'

// assets
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg'

// redux
import { getSmsUnitPrice } from '../../reducers/smsUnitPrices/smsUnitPricesActions'
import { getSmsStats } from '../../reducers/sms/smsActions'

// hooks
import useBackUrl from '../../hooks/useBackUrl'
import RechargeSmsCredit from '../../components/RechargeSmsCredit/RechargeSmsCredit'

const RechargeSmsCreditPartnerPage: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const submitting = useSelector(isSubmitting(FORM.RECHARGE_SMS_CREDIT))
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const walletID = selectedSalon?.data?.wallet?.id

	const smsPriceUnit = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPrice)
	const stats = useSelector((state: RootState) => state.sms.stats)

	const isLoading = submitting || smsPriceUnit.isLoading || selectedSalon.isLoading || stats.isLoading

	const validFrom = smsPriceUnit?.data?.validFrom
	const validPriceLabel = validFrom ? t('loc:Aktuálna cena SMS platná od {{ validFrom }}', { validFrom: dayjs(validFrom).format(D_M_YEAR_FORMAT) }) : t('loc:Aktuálna cena SMS')

	const [backUrl] = useBackUrl(parentPath + t('paths:sms-credit'))

	useEffect(() => {
		;(async () => {
			if (!walletID) {
				return
			}
			const { data } = await dispatch(getSmsStats(salonID))
			const priceId = data?.currentSmsUnitPrice?.id
			if (priceId) {
				dispatch(getSmsUnitPrice(priceId))
			}
		})()
	}, [dispatch, salonID, walletID])

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
			{!walletID ? (
				<Alert
					className='mt-6'
					title={t('loc:Nastavte si adresu salóna')}
					subTitle={t(
						'loc:Aby ste mohli používať kreditný systém so všetkými jeho výhodami, najprv musíte mať vyplnenú adresu vášho salóna. Prejdite do nastavení Detailu salóna.'
					)}
					message={''}
					actionLabel={t('loc:Nastaviť adresu')}
					icon={<SettingIcon />}
					onActionItemClick={() => navigate(parentPath as string)}
				/>
			) : (
				<RechargeSmsCredit
					handleRechargeCredit={handleRechargeCredit}
					currencySymbol={selectedSalon.data?.currency.symbol || ''}
					loading={isLoading}
					description={
						<ul className={'list-none p-0 m-0 mb-8'}>
							<li className={'flex justify-between gap-2 mb-2'}>
								<strong>{t('loc:Salón')}:</strong> {selectedSalon.data?.name}
							</li>
							<li className={'flex justify-between gap-2'}>
								<strong>{validPriceLabel}:</strong>
								{stats.data?.currentSmsUnitPrice?.formattedAmount || '-'}
							</li>
						</ul>
					}
				/>
			)}
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO]))(RechargeSmsCreditPartnerPage)
