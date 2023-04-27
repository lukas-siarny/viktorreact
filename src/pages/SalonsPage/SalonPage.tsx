import React, { FC, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { map } from 'lodash'
import { useLocation, useNavigate } from 'react-router'
import i18next from 'i18next'
import { Row } from 'antd'
import { compose } from 'redux'

// components
import CreateSalonPage from './CreateSalonPage'
import EditSalonPage from './EditSalonPage'
import Breadcrumbs from '../../components/Breadcrumbs'
import TabsComponent from '../../components/TabsComponent'
import SalonHistoryPage from './SalonHistoryPage'

// utils
import { getPrefixCountryCode } from '../../utils/helper'
import { checkPermissions, withPermissions } from '../../utils/Permissions'

// enums
import { ENUMERATIONS_KEYS, FORM, NEW_SALON_ID, PERMISSION, TAB_KEYS } from '../../utils/enums'

// reducers
import { getSalonLanguages } from '../../reducers/languages/languagesActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, SalonPageProps, SalonSubPageProps } from '../../types/interfaces'
import { RootState } from '../../reducers'

// hooks
import useBackUrl from '../../hooks/useBackUrl'
import { useChangeOpeningHoursFormFields } from '../../components/OpeningHours/OpeningHoursUtils'

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

const SalonPage: FC<SalonSubPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { pathname } = useLocation()

	const { salonID } = props

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const isDeletedSalon = !!salon?.data?.deletedAt && salon?.data?.deletedAt !== null

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON]?.values)

	const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

	const isNotinoUser = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.NOTINO]), [authUser])

	const isNewSalon = salonID === NEW_SALON_ID

	const [backUrl] = useBackUrl(t('paths:salons'))

	const activeKey = getTabView(pathname, salonID)

	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend

	useChangeOpeningHoursFormFields(FORM.SALON, formValues?.openingHours, sameOpenHoursOverWeekFormValue, openOverWeekendFormValue)

	useEffect(() => {
		if (!isNewSalon) {
			dispatch(selectSalon(salonID))
		}
	}, [dispatch, salonID, isNewSalon])

	useEffect(() => {
		dispatch(getSalonLanguages())
	}, [dispatch])

	const commonProps: SalonPageProps = {
		phonePrefixCountryCode,
		authUser,
		phonePrefixes
	}

	const onTabChange = (selectedTabKey: string) => navigate(getTabUrl(selectedTabKey as TAB_KEYS, salonID))

	const salonDetail = <EditSalonPage {...commonProps} salonID={salonID} salon={salon} isNotinoUser={isNotinoUser} isDeletedSalon={isDeletedSalon} backUrl={backUrl} />

	const getBreadcrumbs = () => {
		let breadcrumbDetailItem
		if (isNewSalon) {
			breadcrumbDetailItem = {
				name: t('loc:Vytvoriť salón')
			}
		} else {
			breadcrumbDetailItem = {
				name: getTabBreadcrumbName(activeKey),
				titleName: `${salon.data?.name ?? ''} | ID: ${salon.data?.id}`
			}
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

		return breadcrumbs
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={getBreadcrumbs()} backButtonPath={t('paths:index')} />
			</Row>
			{isNewSalon ? (
				<CreateSalonPage {...commonProps} />
			) : (
				<>
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
									children: <SalonHistoryPage salonID={salonID} />
								}
							]}
						/>
					) : (
						salonDetail
					)}
				</>
			)}
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(SalonPage)
