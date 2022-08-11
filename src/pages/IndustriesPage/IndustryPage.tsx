import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Divider, Empty, Row, Spin } from 'antd'
import { compose } from 'redux'
import { getFormValues, initialize, isSubmitting } from 'redux-form'
import { DataNode } from 'antd/lib/tree'
import { isEmpty, map } from 'lodash'
import i18next from 'i18next'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import IndustryForm from './components/IndustryForm'
import { NestedMultiselectDataItem } from './components/CheckboxGroupNestedField'

// utils
import { ROW_GUTTER_X_DEFAULT, PERMISSION, FORM } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { patchReq } from '../../utils/request'
import { flattenTree } from '../../utils/helper'
import { history } from '../../utils/history'

// types
import { IBreadcrumbs, IIndustryForm, SalonSubPageProps, IComputedMatch } from '../../types/interfaces'
import { Paths } from '../../types/api'

// assets
import { ReactComponent as ServiceIcon } from '../../assets/icons/services-24-icon.svg'
import { ReactComponent as ChevronDown } from '../../assets/icons/chevron-down.svg'

type Props = SalonSubPageProps & {
	computedMatch: IComputedMatch<{ industryID: string }>
}
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
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const { industryID } = props.computedMatch.params

	const categories = useSelector((state: RootState) => state.categories.categories)
	const services = useSelector((state: RootState) => state.service.services)
	const submitting = useSelector(isSubmitting(FORM.INDUSTRY))

	const formValues = useSelector((state: RootState) => getFormValues(FORM.INDUSTRY)(state)) as IIndustryForm

	const rootCategory = categories.data?.find((category) => category.id === industryID)
	const rootUserCategory = services?.data?.groupedServicesByCategory?.find((category) => category.category?.id === industryID)

	// https://ant.design/components/tree/#Note - nastava problem, ze pokial nie je vygenerovany strom, tak sa vyrendruje collapsnuty, aj ked je nastavena propa defaultExpandAll
	// preto sa setuje cez state az po tom, co sa vytvoria data pre strom (vid useEffect nizzsie)
	// cize pokial je null, znamena ze strom este nebol vygenerovany a zobrazuje sa loading state
	const [dataTree, setDataTree] = useState<DataNode[] | null>(null)
	const isLoadingTree = dataTree === null

	useEffect(() => {
		;(async () => {
			const categoriesData = await dispatch(getCategories())
			const root = categoriesData?.data?.find((category) => category.id === industryID)

			if (dataTree === null) {
				setDataTree(mapCategoriesForDataTree(null, root ? [root] : undefined))
			}
		})()
	}, [dispatch, dataTree, industryID])

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
				name: t('loc:Zoznam odvetví'),
				link: parentPath + t('paths:industries')
			},
			{
				name: t('loc:Priradiť služby'),
				titleName: rootCategory?.name
			}
		]
	}

	const handleSubmit = async (values: IIndustryForm) => {
		const categoryIDs = getServiceIdsFromFormValues(values)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/services', { salonID }, {
				rootCategoryID: industryID,
				categoryIDs
			} as CategoriesPatch)

			// redirect to service detail edit page in case it's users's first selected service
			const servicesKeys = getServicesCategoryKeys(services.data?.groupedServicesByCategory || [])
			if (isEmpty(servicesKeys) && !isEmpty(categoryIDs)) {
				history.push(parentPath + t('paths:services/{{serviceID}}', { serviceID: categoryIDs[0] }))
			} else {
				dispatch(getServices({ salonID }))
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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:industries')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body small'>
						<Spin spinning={loading || submitting}>
							<h3 className={'mb-0 mt-0 flex items-center'}>
								<ServiceIcon className={'text-notino-black mr-2'} />
								{t('loc:Priradiť služby')}
							</h3>
							<Divider className={'mb-3 mt-3'} />

							<header className={'category-select-header mb-4'}>
								<div className={'image'} style={{ backgroundImage: `url("${rootCategory?.image?.original}")` }} />
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
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(IndustryPage)
