import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Row, TabsProps } from 'antd'
import { useNavigate } from 'react-router-dom'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import TabsComponent from '../../components/TabsComponent'

// utils
import { checkPermissions, withPermissions } from '../../utils/Permissions'
import { PERMISSION, SALONS_TAB_KEYS } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs } from '../../types/interfaces'

import SalonsActivePage from './SalonsActivePage'
import SalonsDeletedPage from './SalonsDeletedPage'
import SalonsRejectedSuggestionsPage from './SalonsRejectedSuggestionsPage'
import SalonsToCheckPage from './SalonsToCheckPage'

type Props = {
	tabKey: SALONS_TAB_KEYS
}
const permissions: PERMISSION[] = [PERMISSION.NOTINO]

const SalonsPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	const { data } = useSelector((state: RootState) => state.categories.categories)

	// transform root categories (industries) into object, where ID is key of record, and content is { image, name }
	const industries: { [key: string]: any } = useMemo(
		() => data?.reduce((result, industry) => ({ ...result, [industry.id]: { image: industry.image?.resizedImages?.thumbnail, name: industry.name } }), {}) || {},
		[data]
	)

	const tabKey = props.tabKey || SALONS_TAB_KEYS.ACTIVE
	const isNotinoUser = useMemo(() => checkPermissions(authUserPermissions, [PERMISSION.NOTINO]), [authUserPermissions])

	useEffect(() => {
		dispatch(selectSalon())
	}, [dispatch])

	// View
	const breadcrumbs: IBreadcrumbs | undefined = isNotinoUser
		? {
				items: [
					{
						name: t('loc:Zoznam salónov')
					}
				]
		  }
		: undefined

	const onTabChange = useCallback(
		(newTabKey: string) => {
			if (newTabKey === SALONS_TAB_KEYS.ACTIVE) {
				navigate(t('paths:salons'))
			}
			if (newTabKey === SALONS_TAB_KEYS.DELETED) {
				navigate(t('paths:salons/deleted'))
			}
			if (newTabKey === SALONS_TAB_KEYS.MISTAKES) {
				navigate(t('paths:salons/rejected'))
			}
			if (newTabKey === SALONS_TAB_KEYS.TO_CHECK) {
				navigate(t('paths:salons/to-check'))
			}
		},
		[navigate, t]
	)

	const tabContent: TabsProps['items'] = useMemo(
		() => [
			{
				key: SALONS_TAB_KEYS.ACTIVE,
				label: <>{t('loc:Aktívne')}</>,
				children: <SalonsActivePage selectedCountry={selectedCountry} />
			},
			{
				key: SALONS_TAB_KEYS.DELETED,
				label: <>{t('loc:Vymazané')}</>,
				children: <SalonsDeletedPage selectedCountry={selectedCountry} />
			},
			{
				key: SALONS_TAB_KEYS.MISTAKES,
				label: <>{t('loc:Omylom navrhnuté na spárovanie')}</>,
				children: <SalonsRejectedSuggestionsPage />
			},
			{
				key: SALONS_TAB_KEYS.TO_CHECK,
				label: <>{t('loc:Na kontrolu zmien')}</>,
				children: <SalonsToCheckPage selectedCountry={selectedCountry} />
			}
		],
		[t, selectedCountry]
	)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent className={'box-tab'} activeKey={tabKey} onChange={onTabChange} items={tabContent} destroyInactiveTabPane />
		</>
	)
}

export default compose(withPermissions(permissions))(SalonsPage)
