import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import { compose } from 'redux'
import { initialize, isSubmitting } from 'redux-form'
import { isEmpty } from 'lodash'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'
import { getServices } from '../../reducers/services/serviceActions'
import { RootState } from '../../reducers'

// components
import IndustriesForm from './components/IndustriesForm'
import Breadcrumbs from '../../components/Breadcrumbs'
import { scrollToTopFn } from '../../components/ScrollToTop'

// utils
import { ROW_GUTTER_X_DEFAULT, PERMISSION, FORM } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { history } from '../../utils/history'
import { patchReq } from '../../utils/request'

// types
import { IBreadcrumbs, IIndustriesForm, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

type CategoriesPatch = Paths.PatchApiB2BAdminSalonsSalonIdCategories.RequestBody

const IndustriesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props

	const categories = useSelector((state: RootState) => state.categories.categories)
	const services = useSelector((state: RootState) => state.service.services)
	const isCategoriesFromSubmitting = useSelector(isSubmitting(FORM.INDUSTRIES))

	useEffect(() => {
		if (isEmpty(categories.data) || !categories.data) {
			dispatch(getCategories())
		}
	}, [dispatch, categories.data])

	useEffect(() => {
		if (isEmpty(services.data) || !services.data) {
			dispatch(getServices({ salonID }))
		}
	}, [dispatch, salonID, services.data])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam odvetví')
			}
		]
	}

	const selectedCategoryIDs = useMemo(() => {
		return services?.data?.groupedServicesByCategory.reduce((acc, item) => {
			if (item.category) {
				acc.push(item.category.id)
			}
			return acc
		}, [] as number[])
	}, [services?.data])

	useEffect(() => {
		const initialValues = {
			categoryIDs: selectedCategoryIDs
		}

		dispatch(initialize(FORM.INDUSTRIES, initialValues))
	}, [dispatch, selectedCategoryIDs])

	const handleSubmit = async (values: IIndustriesForm) => {
		// TODO: remove any
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/categories', { salonID: salonID as any }, {
				categoryIDs: values.categoryIDs
			} as CategoriesPatch)
			dispatch(getServices({ salonID }))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
		} finally {
			scrollToTopFn()
		}
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body small'>
						<Spin spinning={categories.isLoading || services.isLoading || isCategoriesFromSubmitting}>
							<IndustriesForm
								selectedCategoryIDs={selectedCategoryIDs}
								onSubmit={handleSubmit}
								disabledForm={categories.isLoading || services.isLoading || isCategoriesFromSubmitting}
								onShowMore={(industryID) => {
									history.push(parentPath + t('paths:industries/{{industryID}}', { industryID }))
								}}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(IndustriesPage)
