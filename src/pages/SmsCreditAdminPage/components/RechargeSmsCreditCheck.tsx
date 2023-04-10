import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

// utils
import { D_M_YEAR_FORMAT } from '../../../utils/enums'
import { postReq } from '../../../utils/request'

// types
import { IEnumerationsCountriesPayload, ILoadingAndFailure, IRechargeSmsCreditForm } from '../../../types/interfaces'

// redux
import { ISmsUnitPricesActualPayload } from '../../../reducers/smsUnitPrices/smsUnitPricesActions'

// hooks
import RechargeSmsCredit from '../../../components/RechargeSmsCredit/RechargeSmsCreditForm'
import { IEnumerationsCurrenciesPayload } from '../../../reducers/enumerations/enumerationActions'

type Props = {
	currency?: NonNullable<IEnumerationsCurrenciesPayload['data']>[0]
	country?: NonNullable<IEnumerationsCountriesPayload['data']>[0]
	walletIDs: string[]
	selectedSalonsCount: number
	smsUnitPricesActual?: ISmsUnitPricesActualPayload & ILoadingAndFailure
	onSuccess: () => void
}

const RechargeSmsCreditCheck: FC<Props> = (props) => {
	const [t] = useTranslation()

	const { currency, walletIDs, country, selectedSalonsCount, smsUnitPricesActual, onSuccess } = props

	const smsPriceUnityForSelectedCountry = smsUnitPricesActual?.data?.find((priceUnit) => priceUnit.country.code === country?.code)

	const validFrom = smsPriceUnityForSelectedCountry?.actual?.validFrom
	const amount = smsPriceUnityForSelectedCountry?.actual?.amount

	const handleRechargeCredit = async (values: IRechargeSmsCreditForm) => {
		if (!currency?.code) {
			return
		}

		try {
			await postReq(
				'/api/b2b/admin/wallets/transactions',
				{},
				{
					amount: values.amount,
					currencyCode: currency.code,
					transactionNote: values.transactionNote || null,
					walletIDs: walletIDs as any
				}
			)
			onSuccess()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	return (
		<RechargeSmsCredit
			onSubmit={handleRechargeCredit}
			currencySymbol={currency?.symbol || ''}
			description={
				<ul className={'list-none p-0 m-0 mb-8'}>
					<li className={'flex justify-between gap-2 mb-2'}>
						<strong>{t('loc:Krajina')}:</strong>{' '}
						<span className={'inline-flex gap-2 items-center'}>
							{country?.flag && <img src={country?.flag} alt={''} height={16} />}
							{country?.name || '-'}
						</span>
					</li>
					<li className={'flex justify-between gap-2 mb-2'}>
						<strong>{t('loc:Počest salónov')}:</strong> {selectedSalonsCount}
					</li>
					<li className={'flex justify-between gap-2'}>
						<strong>
							{validFrom ? t('loc:Aktuálna cena SMS platná od {{ validFrom }}', { validFrom: dayjs(validFrom).format(D_M_YEAR_FORMAT) }) : t('loc:Aktuálna cena SMS')}
							:
						</strong>
						{amount ? `${amount} ${currency?.symbol || ''}` : '-'}
					</li>
				</ul>
			}
		/>
	)
}

export default RechargeSmsCreditCheck
