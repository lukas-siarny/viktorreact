import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Empty, Modal, Row, Spin } from 'antd'
import { compose } from 'redux'
import { getFormValues, initialize, isSubmitting, reset } from 'redux-form'
import { isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import IndustryForm from './components/IndustryForm'
import RequestNewServiceForm from './components/RequestNewServiceForm'

// utils
import { FORM, PERMISSION, NOTIFICATION_TYPE } from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { patchReq, postReq } from '../../utils/request'
import { flattenTree, transformToLowerCaseWithoutAccent } from '../../utils/helper'

// types
import { IBreadcrumbs, IIndustryFilter, IServicesSelectionData, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// assets
import { ReactComponent as ServiceIcon } from '../../assets/icons/services-24-icon.svg'
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-modal.svg'

// schema
import { IIndustryForm } from '../../schemas/industry'
import { IRequestNewServiceForm } from '../../schemas/service'
import IndustryFilter from './components/IndustryFilter'

type Props = SalonSubPageProps
type CategoriesPatch = Paths.PatchApiB2BAdminSalonsSalonIdServices.RequestBody

const getCategoryById = (category: any, serviceCategoryID: string) => {
	let result = null
	if (category?.category?.id === serviceCategoryID) {
		return category
	}
	if (category?.category?.children) {
		// eslint-disable-next-line no-return-assign
		category.category.children.some((node: any) => (result = getCategoryById(node, serviceCategoryID)))
	}
	return result
}

export const getServicesCategoryKeys = (array: any[]) => {
	let output: any[] = []

	array.forEach((item: any) => {
		if (item?.service?.id) {
			output.push(item?.category?.id)
		}
		output = output.concat(getServicesCategoryKeys(item.category.children || []))
	})
	return output
}

const getServiceCategoryIdsFromFormValues = (values?: IIndustryForm) =>
	Object.values(values?.categoryIDs || {}).reduce((acc, cv) => [...acc, ...cv.serviceCategoryIDs], [] as string[])

const IndustryPage = (props: Props) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const { industryID } = useParams<{ industryID?: string }>()

	const categories = useSelector((state: RootState) => state.categories.categories)
	const services = useSelector((state: RootState) => state.service.services)
	const submitting = useSelector(isSubmitting(FORM.INDUSTRY))

	const formValues = useSelector((state: RootState) => getFormValues(FORM.INDUSTRY)(state)) as IIndustryForm

	const rootCategory = categories.data?.find((category) => category.id === industryID)

	const [isVisible, setIsVisible] = useState<boolean>(false)
	const [servicesSelectionData, setServicesSelectionData] = useState<IServicesSelectionData | null>(null)

	const [query, setQuery] = useState<IIndustryFilter>({
		search: ''
	})

	const servicesLength = rootCategory ? flattenTree([rootCategory], (item, level) => ({ ...item, level })).filter((category) => category.level === 2).length : 0
	const selectedServiceCategoryIDs = getServiceCategoryIdsFromFormValues(formValues)

	const areThereAnyServiceCategories = rootCategory?.children.some((secondLevelCategory) => secondLevelCategory.children?.length)

	const loading = categories.isLoading || services.isLoading

	useEffect(() => {
		;(async () => {
			const categoriesData = await dispatch(getCategories())
			const salonCategoriesData = await dispatch(getServices({ salonID }))
			const rootCategoryData = categoriesData?.data?.find((category) => category.id === industryID)
			const rootCategorySalonData = salonCategoriesData?.data?.groupedServicesByCategory?.find((category) => category.category?.id === industryID)

			if (!rootCategoryData) {
				navigate('/404')
			} else {
				let formInitialValues: IIndustryForm = { categoryIDs: {} }

				rootCategoryData.children.forEach((category) => {
					const serviceCategoryIDs: string[] = []
					const categoryDataForm = {
						serviceCategoryIDs,
						orderIndex: category.orderIndex
					}

					category.children.forEach((serviceCategory) => {
						const servicesDataUser = getCategoryById(rootCategorySalonData, serviceCategory.id)
						if (servicesDataUser?.category?.id) {
							serviceCategoryIDs.push(servicesDataUser.category.id)
						}
					})

					formInitialValues = {
						...formInitialValues,
						categoryIDs: {
							...formInitialValues.categoryIDs,
							[category.id]: categoryDataForm
						}
					}
				})

				dispatch(initialize(FORM.INDUSTRY, formInitialValues))
			}
		})()
	}, [dispatch, industryID, salonID, navigate])

	useEffect(() => {
		if (rootCategory) {
			const searchValue = transformToLowerCaseWithoutAccent(query.search || undefined)

			const dataServicesSelection: IServicesSelectionData = rootCategory.children.reduce((categoriesAcc, category) => {
				const options = category.children.reduce((optionsAcc, serviceCategory) => {
					if ((searchValue && transformToLowerCaseWithoutAccent(serviceCategory.name)?.includes(searchValue)) || !searchValue) {
						return [
							...optionsAcc,
							{
								value: serviceCategory.id,
								label: serviceCategory.name
							}
						]
					}
					return optionsAcc
				}, [] as IServicesSelectionData[keyof IServicesSelectionData]['options'])

				if (options.length) {
					const categoryDataServiceSelection: IServicesSelectionData[keyof IServicesSelectionData] = {
						options,
						title: category.name || '-',
						orderIndex: category.orderIndex
					}

					return {
						...categoriesAcc,
						[category.id]: categoryDataServiceSelection
					}
				}

				return categoriesAcc
			}, {} as IServicesSelectionData)
			setServicesSelectionData(dataServicesSelection)
		}
		dispatch(initialize(FORM.INDUSTRY_FILTER, { search: query.search }))
	}, [query.search, rootCategory, dispatch])

	const handleSubmitFilter = (values: IIndustryFilter) => {
		setQuery({ ...query, search: values.search })
	}

	const handleSubmitRequestNewService = async (data: IRequestNewServiceForm) => {
		try {
			const reqData = {
				salonID,
				rootCategoryID: data.rootCategoryID,
				description: data.description
			}
			await postReq('/api/b2b/admin/services/category-service-suggest', {}, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			dispatch(reset(FORM.REQUEST_NEW_SERVICE_FORM))
			setIsVisible(false)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const handleSubmit = async () => {
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/services', { salonID }, {
				rootCategoryID: industryID,
				categoryIDs: selectedServiceCategoryIDs
			} as CategoriesPatch)
			const updatedServicesData = await dispatch(getServices({ salonID }))

			// redirect to service detail edit page in case it's first selected service in salon
			const servicesKeys = getServicesCategoryKeys(services.data?.groupedServicesByCategory || [])
			// check if there were any services saved before (servicesKeys) and if there are any new services to be saved (categoryIDs)
			if (isEmpty(servicesKeys) && !isEmpty(selectedServiceCategoryIDs)) {
				// find rootCategory from updated service data
				const updatedUserRootCategory = updatedServicesData.data?.groupedServicesByCategory.find((category) => category.category?.id === industryID)
				// find service id in a rootCategory tree based on first selected service ID
				const serviceID = getCategoryById(updatedUserRootCategory, selectedServiceCategoryIDs[0])?.service?.id
				// redirect
				if (serviceID) {
					navigate(parentPath + t('paths:services-settings/{{serviceID}}', { serviceID }))
				}
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam odvetví a služieb'),
				link: parentPath + t('paths:industries-and-services')
			},
			{
				name: t('loc:Priradiť služby'),
				titleName: rootCategory?.name
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:industries-and-services')} />
			</Row>

			<div className='content-body small'>
				<Spin spinning={loading || submitting}>
					<Row justify='space-between'>
						<h3 className={'mb-0 mt-0 flex items-center pr-4'}>
							<ServiceIcon className={'text-notino-black mr-2'} />
							{t('loc:Priradiť služby')}
						</h3>
						<Permissions
							allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<Button
									onClick={() => {
										if (hasPermission) {
											setIsVisible(true)
										} else {
											openForbiddenModal()
										}
									}}
									type='primary'
									htmlType='button'
									className={'noti-btn'}
									icon={<PlusIcon />}
								>
									{t('loc:Požiadať o novú službu')}
								</Button>
							)}
						/>
					</Row>
					<Divider className={'mb-3 mt-3'} />

					<header className={'category-select-header mb-4'}>
						<div className={'image'} style={{ backgroundImage: `url("${rootCategory?.image?.resizedImages?.small}")` }} />
						<div className={'count'}>{`${selectedServiceCategoryIDs.length} ${t('loc:z')} ${servicesLength}`}</div>
						<span className={'label'}>{rootCategory?.name}</span>
					</header>
					{!loading && !areThereAnyServiceCategories ? (
						<div className='h-100 w-full flex items-center justify-center'>
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('loc:V tomto odvetví nie sú dostupné na výber žiadne služby')} />
						</div>
					) : (
						<>
							<IndustryFilter onSubmit={handleSubmitFilter} />
							<IndustryForm onSubmit={handleSubmit} servicesSelectionData={servicesSelectionData} loadingData={loading} />
						</>
					)}
				</Spin>
			</div>

			<Modal
				key={'requestNewServiceModal'}
				title={t('loc:Žiadosť o novú službu')}
				open={isVisible}
				onCancel={() => {
					dispatch(reset(FORM.REQUEST_NEW_SERVICE_FORM))
					setIsVisible(false)
				}}
				footer={null}
				closeIcon={<CloseIcon />}
			>
				<RequestNewServiceForm onSubmit={handleSubmitRequestNewService} />
			</Modal>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(IndustryPage)
