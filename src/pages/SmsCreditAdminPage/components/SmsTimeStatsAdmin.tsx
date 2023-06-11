import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-icon.svg'

// utils
import { LANGUAGE, SMS_TIME_STATS_COUNTRY_PICKER_ID } from '../../../utils/enums'
import { optionRenderWithImage } from '../../../utils/helper'
import { LOCALES } from '../../../components/LanguagePicker'

// types
import { IEnumerationsCountriesPayload, ILoadingAndFailure } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

// redux
import { getSmsTimeStatsForCountry } from '../../../reducers/sms/smsActions'

// components
import SelectField from '../../../atoms/SelectField'
import SmsTimeStats from '../../../components/Dashboards/SmsTimeStats'

type Props = {
	countries: IEnumerationsCountriesPayload & ILoadingAndFailure
}

const SmsTimeStatsAdmin: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { countries } = props

	const [smsStatsDate, setSmsStatsDate] = useState(dayjs())
	const smsTimeStats = useSelector((state: RootState) => state.sms.timeStats)
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	const [smsStatsCountryCode, setSmsStatsCountryCode] = useState(selectedCountry || LOCALES[LANGUAGE.CZ].countryCode)

	useEffect(() => {
		if (smsStatsCountryCode) {
			dispatch(getSmsTimeStatsForCountry(smsStatsCountryCode, smsStatsDate.year(), smsStatsDate.month() + 1))
		}
	}, [dispatch, smsStatsCountryCode, smsStatsDate])

	return (
		<SmsTimeStats
			onPickerChange={(date) => {
				if (date) {
					setSmsStatsDate(date)
				}
			}}
			title={<h2 className={'mb-0'}>{t('loc:Spotreba SMS kreditu za obdobie')}</h2>}
			selectedDate={smsStatsDate}
			smsTimeStats={smsTimeStats}
			className={'mt-6 mb-16 py-0'}
			countryPicker={
				<SelectField
					id={SMS_TIME_STATS_COUNTRY_PICKER_ID}
					input={{ value: smsStatsCountryCode, onChange: (value: any) => setSmsStatsCountryCode(value) } as any}
					meta={{} as any}
					optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
					name={'countryCode'}
					placeholder={t('loc:Krajina')}
					size={'middle'}
					className={'mb-0 pb-0 w-48'}
					options={countries?.enumerationsOptions}
					loading={countries?.isLoading}
					disabled={countries?.isLoading}
				/>
			}
		/>
	)
}

export default SmsTimeStatsAdmin
