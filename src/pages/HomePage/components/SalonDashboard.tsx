import React, { FC, useEffect, useCallback } from 'react'
import { Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// redux
import { RootState } from '../../../reducers'
import { getServices } from '../../../reducers/services/serviceActions'
import { getEmployees } from '../../../reducers/employees/employeesActions'
import { getCustomers } from '../../../reducers/customers/customerActions'

// utils
import { SALON_STATES } from '../../../utils/enums'
import { history } from '../../../utils/history'

// components
import Alert from '../../../components/Dashboards/Alert'
import Statistics from '../../../components/Dashboards/Statistics'

// assets
import { ReactComponent as EyeOffIcon } from '../../../assets/icons/eye-off-pink.svg'

const SalonDashboard: FC = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { children } = props

	const { selectedSalon } = useSelector((state: RootState) => state.selectedSalon)
	const { services } = useSelector((state: RootState) => state.service)
	const { employees } = useSelector((state: RootState) => state.employees)
	const { customers } = useSelector((state: RootState) => state.customers)

	const loading = selectedSalon?.isLoading || services?.isLoading || employees?.isLoading || customers?.isLoading
	const basePath = t('paths:salons/{{salonID}}', { salonID: selectedSalon?.data?.id })

	const getPath = useCallback((pathSuffix: string) => `${basePath}${pathSuffix}`, [basePath])

	useEffect(() => {
		if (selectedSalon?.data) {
			dispatch(getServices({ salonID: selectedSalon.data.id }))
			dispatch(getCustomers({ salonID: selectedSalon.data.id, page: 1 }))
			dispatch(getEmployees({ salonID: selectedSalon.data.id, page: 1 }))
		}
	}, [dispatch, selectedSalon?.data])

	return loading ? (
		<div className='w-full text-center'>
			<Spin spinning={true} />
		</div>
	) : (
		<>
			{selectedSalon?.data ? (
				<div>
					{/* hidden salon */}
					{selectedSalon.data?.state === SALON_STATES.NOT_PUBLISHED && selectedSalon.data?.publicationDeclineReason && (
						<Alert
							className='mb-8'
							title={t('loc:Skrytý salón')}
							subTitle={`${t('loc:Salón bol skrytý z dôvodu')}:`}
							message={selectedSalon.data?.publicationDeclineReason}
							actionLabel={t('loc:Upraviť údaje salónu')}
							icon={<EyeOffIcon />}
							onActionItemClick={() => history.push(basePath)}
						/>
					)}
					{/* declined salon */}
					{(selectedSalon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED || selectedSalon.data?.state === SALON_STATES.PUBLISHED_DECLINED) && (
						<Alert
							className='mb-8'
							title={t('loc:Zamietnutý salón')}
							subTitle={`${t('loc:Salón bol zamietnutý z dôvodu')}:`}
							message={selectedSalon.data?.publicationDeclineReason ?? t('loc:Bez udania dôvodu.')}
							actionLabel={t('loc:Upraviť údaje salónu')}
							onActionItemClick={() => history.push(basePath)}
						/>
					)}

					<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 3xl:gap-8'>
						<Statistics
							title={t('loc:Počet zákazníkov')}
							count={customers.data?.pagination.totalCount}
							onActionItemClick={() => history.push(getPath(t('paths:customers')))}
						/>
						<Statistics
							title={t('loc:Počet aktívnych služieb')}
							count={services?.tableData?.length}
							onActionItemClick={() => history.push(getPath(t('paths:services-settings')))}
						/>
						<Statistics
							title={t('loc:Počet zamestnancov')}
							count={employees?.data?.pagination.totalCount}
							onActionItemClick={() => history.push(getPath(t('paths:employees')))}
						/>
						<Statistics title={t('loc:Vyplnenosť profilu')} count={`${selectedSalon.data.fillingProgressSalon}%`} onActionItemClick={() => history.push(basePath)} />
					</div>
				</div>
			) : (
				children
			)}
		</>
	)
}

export default SalonDashboard
