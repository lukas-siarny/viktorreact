import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { useEffect } from 'react'
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION } from '../../utils/enums'

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
		statuses: withDefault(StringParam, 'ALL'),
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'fullName:ASC')
	})

	useEffect(() => {
		dispatch(getSalons())
	}, [])

	return <>TEST</>
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_BROWSING]))(SalonsPage)
