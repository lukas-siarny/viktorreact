import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { useEffect } from 'react'
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'

// utils
import { initialize } from 'redux-form'
import { withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION, SALON_STATUSES } from '../../utils/enums'

// reducers
import { getSalons } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'

const SalonsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const salons = useSelector((state: RootState) => state.salons.salons)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		categoryFirstLevelID: NumberParam,
		statuses: withDefault(StringParam, SALON_STATUSES.ALL),
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'fullName:ASC')
	})

	useEffect(() => {
		dispatch(initialize(FORM.SALONS_FILTER, { search: query.search }))
		dispatch(getSalons(query.page, query.limit, query.order, query.search, query.categoryFirstLevelID, query.statuses))
	}, [dispatch, query.page, query.limit, query.search, query.order, query.categoryFirstLevelID, query.statuses])

	return <>TEST</>
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_BROWSING]))(SalonsPage)
