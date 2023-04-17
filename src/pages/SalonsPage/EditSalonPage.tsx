import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row } from 'antd'
import { compose } from 'redux'
import { useLocation, useNavigate } from 'react-router-dom'
import i18next from 'i18next'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import TabsComponent from '../../components/TabsComponent'
import SalonHistory from './components/SalonHistory'
import SalonDetail from './components/SalonDetail'

// enums
import { PERMISSION, TAB_KEYS } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs, EditSalonPageProps } from '../../types/interfaces'

// utils
import { withPermissions } from '../../utils/Permissions'

// hooks
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

const permissions: PERMISSION[] = [PERMISSION.NOTINO, PERMISSION.PARTNER]

const getTabView = (pathname: string, salonID: string) => {
	switch (pathname) {
		case `${i18next.t('paths:salons')}/${salonID}/${i18next.t('paths:history')}`:
			return TAB_KEYS.SALON_HISTORY
		case `${i18next.t('paths:salons')}/${salonID}`:
		default:
			return TAB_KEYS.SALON_DETAIL
	}
}

const getTabUrl = (selectedTabKey: TAB_KEYS, salonID: string) => {
	switch (selectedTabKey) {
		case TAB_KEYS.SALON_HISTORY:
			return `${i18next.t('paths:salons')}/${salonID}/${i18next.t('paths:history')}`
		case TAB_KEYS.SALON_DETAIL:
		default:
			return `${i18next.t('paths:salons')}/${salonID}`
	}
}

const getTabBreadcrumbName = (selectedTabKey: TAB_KEYS) => {
	switch (selectedTabKey) {
		case TAB_KEYS.SALON_HISTORY:
			return i18next.t('loc:História salónu')
		case TAB_KEYS.SALON_DETAIL:
		default:
			return i18next.t('loc:Detail salónu')
	}
}

const EditSalonPage: FC<EditSalonPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, isNotinoUser, backUrl } = props

	const { pathname } = useLocation()
	const navigate = useNavigate()

	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const isDeletedSalon = !!salon?.data?.deletedAt && salon?.data?.deletedAt !== null

	const activeKey = getTabView(pathname, salonID)

	useEffect(() => {
		dispatch(selectSalon(salonID))
	}, [dispatch, salonID])

	const breadcrumbDetailItem = {
		name: getTabBreadcrumbName(activeKey),
		titleName: `${salon.data?.name ?? ''} | ID: ${salon.data?.id}`
	}

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: isNotinoUser
			? [
					{
						name: t('loc:Zoznam salónov'),
						link: backUrl
					},
					breadcrumbDetailItem
			  ]
			: [breadcrumbDetailItem]
	}

	const onTabChange = (selectedTabKey: string) => navigate(getTabUrl(selectedTabKey as TAB_KEYS, salonID))

	const salonDetail = <SalonDetail {...props} salon={salon} isDeletedSalon={isDeletedSalon} />

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			{isNotinoUser && !isDeletedSalon ? (
				<TabsComponent
					className={'box-tab'}
					activeKey={activeKey}
					onChange={onTabChange}
					destroyInactiveTabPane
					items={[
						{
							key: TAB_KEYS.SALON_DETAIL,
							label: t('loc:Detail salónu'),
							children: salonDetail
						},
						{
							key: TAB_KEYS.SALON_HISTORY,
							label: t('loc:História salónu'),
							children: <SalonHistory salonID={salonID} />
						}
					]}
				/>
			) : (
				salonDetail
			)}
		</>
	)
}

export default compose(withPermissions(permissions))(EditSalonPage)
