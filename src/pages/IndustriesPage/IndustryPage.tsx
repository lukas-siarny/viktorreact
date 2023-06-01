import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Divider, Empty, Modal, Row, Spin } from 'antd'
import { compose } from 'redux'
import { getFormValues, initialize, isSubmitting, reset } from 'redux-form'
import { DataNode } from 'antd/lib/tree'
import { isEmpty, map } from 'lodash'
import i18next from 'i18next'
import { useNavigate, useParams } from 'react-router-dom'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import IndustryForm from './components/IndustryForm'
import { NestedMultiselectDataItem } from './components/CheckboxGroupNestedField'
import RequestNewServiceForm from './components/RequestNewServiceForm'

// utils
import { ROW_GUTTER_X_DEFAULT, FORM, PERMISSION, NOTIFICATION_TYPE } from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { patchReq, postReq } from '../../utils/request'
import { flattenTree } from '../../utils/helper'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// assets
import { ReactComponent as ServiceIcon } from '../../assets/icons/services-24-icon.svg'
import { ReactComponent as ChevronDown } from '../../assets/icons/chevron-down.svg'
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-modal.svg'

// schema
import { IIndustryForm } from '../../schemas/industry'
import { IRequestNewServiceForm } from '../../schemas/service'

type Props = SalonSubPageProps
type CategoriesPatch = Paths.PatchApiB2BAdminSalonsSalonIdServices.RequestBody

// create category keys
//  keys with prefix level2 are service keys
const getCategoryKey = (id: string, level: number) => `level${level}_${id}`

// parse serviceIDs from category keys
export const getServiceIdsFromFormValues = (values: IIndustryForm) => {
	return values?.categoryIDs.reduce((categoryKeys, key) => {
		if (key.startsWith('level2')) {
			const split = key.split('_')
			categoryKeys.push(split[1])
		}
		return categoryKeys
	}, [] as string[])
}

export const getServicesCategoryKeys = (array: any[], levelOfDepth = 0) => {
	let output: any[] = []

	array.forEach((item: any) => {
		if (levelOfDepth === 2) {
			output.push(getCategoryKey(item?.category?.id, levelOfDepth))
		}
		output = output.concat(getServicesCategoryKeys(item.category.children || [], levelOfDepth + 1))
	})
	return output
}

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

const mapCategoriesForDataTree = (parentId: string | null, children: any[] | undefined, level = 0) => {
	const childs: NestedMultiselectDataItem[] & any = children
	const items: DataNode[] = map(childs, (child, index) => {
		return {
			className: `noti-tree-node-${level}`,
			switcherIcon: (props) => {
				if (level !== 1) {
					return undefined
				}
				return props?.expanded ? <ChevronDown style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown />
			},
			id: child.id,
			title: level === 0 ? i18next.t('loc:Vybrať všetky služby odevetvia') : child.name,
			key: getCategoryKey(child.id, level),
			disabled: false,
			parentId,
			children: child.children ? mapCategoriesForDataTree(child.id, child.children, level + 1) : undefined,
			level,
			index
		}
	})
	return items
}

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
	const rootUserCategory = services?.data?.groupedServicesByCategory?.find((category) => category.category?.id === industryID)

	// https://ant.design/components/tree/#Note - nastava problem, ze pokial nie je vygenerovany strom, tak sa vyrendruje collapsnuty, aj ked je nastavena propa defaultExpandAll
	// preto sa strom setuje cez state az po tom, co sa vytvoria data pre strom (vid useEffect nizzsie)
	// cize pokial je null, znamena ze strom este nebol vygenerovany a zobrazuje sa loading state
	const [dataTree, setDataTree] = useState<DataNode[] | null>(null)
	const isLoadingTree = dataTree === null

	const [isVisible, setIsVisible] = useState<boolean>(false)

	useEffect(() => {
		;(async () => {
			const categoriesData = await dispatch(getCategories())
			const root = categoriesData?.data?.find((category) => category.id === industryID)

			if (!root) {
				navigate('/404')
			} else {
				setDataTree(mapCategoriesForDataTree(null, [root]))
			}
		})()
	}, [dispatch, industryID, navigate])

	useEffect(() => {
		dispatch(getServices({ salonID }))
	}, [dispatch, salonID])

	useEffect(() => {
		const initialValues = {
			categoryIDs: getServicesCategoryKeys(rootUserCategory ? [rootUserCategory] : [])
		}

		dispatch(initialize(FORM.INDUSTRY, initialValues))
	}, [dispatch, rootUserCategory])

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

	const handleSubmit = async (values: IIndustryForm) => {
		const categoryIDs = getServiceIdsFromFormValues(values)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/services', { salonID }, {
				rootCategoryID: industryID,
				categoryIDs
			} as CategoriesPatch)
			const updatedServicesData = await dispatch(getServices({ salonID }))

			// redirect to service detail edit page in case it's first selected service in salon
			const servicesKeys = getServicesCategoryKeys(services.data?.groupedServicesByCategory || [])
			// check if there were any services saved before (servicesKeys) and if there are any new services to be saved (categoryIDs)
			if (isEmpty(servicesKeys) && !isEmpty(categoryIDs)) {
				// find rootCategory from updated service data
				const updatedUserRootCategory = updatedServicesData.data?.groupedServicesByCategory.find((category) => category.category?.id === industryID)
				// find service id in a rootCategory tree based on first selected service ID
				const serviceID = getCategoryById(updatedUserRootCategory, categoryIDs[0])?.service?.id
				// redirect
				if (serviceID) {
					navigate(parentPath + t('paths:services-settings/{{serviceID}}', { serviceID }))
				}
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
		}
	}

	const servicesLength = rootCategory ? flattenTree([rootCategory], (item, level) => ({ ...item, level })).filter((category) => category.level === 2).length : 0
	const selectedServicesLength = getServiceIdsFromFormValues(formValues)?.length || 0

	const areThereAnyServiceCategories = rootCategory?.children.some((secondLevelCategory) => secondLevelCategory.children?.length)

	const loading = categories.isLoading || services.isLoading || isLoadingTree

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:industries-and-services')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
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
								<div className={'count'}>{`${selectedServicesLength} ${t('loc:z')} ${servicesLength}`}</div>
								<span className={'label'}>{rootCategory?.name}</span>
							</header>
							{!loading && !areThereAnyServiceCategories ? (
								<div className='h-100 w-full flex items-center justify-center'>
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('loc:V tomto odvetví nie sú dostupné na výber žiadne služby')} />
								</div>
							) : (
								<IndustryForm onSubmit={handleSubmit} dataTree={dataTree} isLoadingTree={isLoadingTree} />
							)}
						</Spin>
					</div>
				</Col>
			</Row>
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
