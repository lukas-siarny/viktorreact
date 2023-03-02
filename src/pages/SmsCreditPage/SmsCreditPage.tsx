import React, { useEffect, FC } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { DatePicker, Row, Spin } from 'antd'
import { useNavigate } from 'react-router'
import dayjs, { Dayjs } from 'dayjs'

// redux
import { RootState } from '../../reducers'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { PERMISSION, FORM, DEFAULT_DATE_INIT_FORMAT, MONTH_NAME_YEAR_FORMAT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'
import Alert from '../../components/Dashboards/Alert'

// assets
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg'

// components
import Wallet from '../../components/Dashboards/Wallet'
import SmsStats from '../../components/Dashboards/SmsStats'
import { getSmsHistory } from '../../reducers/sms/smsActions'
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'
import SmsHistory from './components/SmsHistory'
import SmsTimeStats from '../../components/Dashboards/SmsTimeStats'

const getQueryParamDate = (date: Dayjs) => date.startOf('month').format('YYYY-MM')

const SmsCreditPage: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath } = props

	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const smsHistory = useSelector((state: RootState) => state.sms.history)

	const isLoading = smsHistory?.isLoading

	const [query, setQuery] = useQueryParams({
		search: StringParam(),
		order: StringParam('createdAt:desc'),
		limit: NumberParam(25),
		page: NumberParam(1),
		year: StringParam(getQueryParamDate(dayjs()))
	})

	useEffect(() => {
		dispatch(
			getSmsHistory({
				salonID,
				page: query.page,
				limit: query.limit,
				search: query.search,
				order: query.order,
				dateFrom: dayjs(query.date).startOf('month').format(DEFAULT_DATE_INIT_FORMAT),
				dateTo: dayjs(query.date).endOf('month').format(DEFAULT_DATE_INIT_FORMAT)
			})
		)
	}, [dispatch, query.page, query.limit, query.search, query.order, query.date, salonID])

	useEffect(() => {
		dispatch(initialize(FORM.SMS_HISTORY_FILTER, { search: query.search }))
	}, [query.search, dispatch])

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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>

			<div className='w-11/12 xl:w-5/6 2xl:w-3/4 3xl:w-2/3 mx-auto mt-10'>
				<Alert
					className='mb-6'
					title={t('loc:Nastavte si SMS notifikácie')}
					subTitle={t('loc:Prejdite do nastavení rezervačného systému a nastavte si SMS notifikácie podľa vašich preferencií')}
					actionLabel={t('loc:Nastaviť SMS notifikácie')}
					icon={<SettingIcon />}
					onActionItemClick={() => navigate(`${parentPath}${t('paths:reservations-settings')}`)}
				/>
				<div className={'flex gap-4 mb-10'}>
					<Wallet salonID={salonID} parentPath={parentPath} />
					<SmsStats salonID={salonID} />
				</div>
				<SmsTimeStats
					onPickerChange={(date) => {
						if (date) {
							setQuery({
								...query,
								date: getQueryParamDate(date)
							})
						}
					}}
					salonID={salonID}
					month={dayjs(query.date).month()}
					year={dayjs(query.date).year()}
				/>
				<SmsHistory smsHistory={smsHistory} query={query} setQuery={setQuery} />
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(SmsCreditPage)
