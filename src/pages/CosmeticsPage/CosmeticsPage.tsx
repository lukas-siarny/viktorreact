import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, Image, TablePaginationConfig } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize, reset } from 'redux-form'
import { get } from 'lodash'
import cx from 'classnames'
import { StringParam, withDefault, useQueryParams } from 'use-query-params'

// components
import { SorterResult } from 'antd/lib/table/interface'
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import CosmeticForm from './components/CosmeticForm'
import CosmeticsFilter from './components/CosmeticsFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { normalizeDirectionKeys, setOrder, sortTableData, transformToLowerCaseWithoutAccent } from '../../utils/helper'

// reducers
import { getCosmetics } from '../../reducers/cosmetics/cosmeticsActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, ICosmetic, ICosmeticForm, Columns } from '../../types/interfaces'
import { RootState } from '../../reducers'

const CosmeticsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)
	// 0 - represents new record
	const [cosmeticID, setCosmeticID] = useState<number>(0)

	const cosmetics = useSelector((state: RootState) => state.cosmetics.cosmetics)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		order: withDefault(StringParam, 'name:ASC')
	})

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam kozmetiky')
			}
		]
	}

	useEffect(() => {
		dispatch(getCosmetics())
	}, [dispatch])

	useEffect(() => {
		dispatch(
			initialize(FORM.COSMETICS_FILTER, {
				search: query.search
			})
		)
	}, [dispatch, query.search])

	const tableData = useMemo(() => {
		if (!cosmetics || !cosmetics.data) {
			return []
		}

		const source = query.search
			? cosmetics.data.filter((cosmetic) => {
					const name = transformToLowerCaseWithoutAccent(cosmetic.name)
					const searchedValue = transformToLowerCaseWithoutAccent(query.search || undefined)
					return name.includes(searchedValue)
			  })
			: cosmetics.data

		// transform to table data
		return source.map((cosmetic) => ({
			...cosmetic,
			key: cosmetic.id
		}))
	}, [query.search, cosmetics])

	const changeFormVisibility = (show?: boolean, cosmetic?: ICosmetic) => {
		if (!show) {
			setVisibleForm(false)
			dispatch(reset(FORM.COSMETIC))
			return
		}

		if (cosmetic) {
			const { image } = cosmetic

			dispatch(
				initialize(FORM.COSMETIC, {
					image: image?.original ? [{ url: image?.original, uid: image?.id }] : undefined,
					name: cosmetic.name
				})
			)
		}

		setCosmeticID(cosmetic ? cosmetic.id : 0)
		setVisibleForm(true)
	}

	const onChangeTable = (_pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...query,
				order
			}
			setQuery(newQuery)
		}
	}

	const handleSubmit = async (formData: ICosmeticForm) => {
		const body = {
			name: formData.name,
			imageID: get(formData, 'image[0].id') || get(formData, 'image[0].uid')
		}

		try {
			if (cosmeticID > 0) {
				await patchReq('/api/b2b/admin/enums/cosmetics/{cosmeticID}', { cosmeticID }, body)
			} else {
				await postReq('/api/b2b/admin/enums/cosmetics/', null, body)
			}
			dispatch(getCosmetics())
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleDelete = async () => {
		try {
			await deleteReq('/api/b2b/admin/enums/cosmetics/{cosmeticID}', { cosmeticID })
			dispatch(getCosmetics())
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
			render: (value) => <span className='base-regular'>{value}</span>,
			sortOrder: setOrder(query.order, 'name'),
			sorter: {
				compare: (a, b) => sortTableData(a.name?.toUpperCase(), b.name?.toUpperCase())
			}
		},
		{
			title: t('loc:Logo'),
			dataIndex: 'image',
			key: 'image',
			render: (value, record) =>
				record?.image ? (
					<Image
						src={record?.image?.resizedImages.thumbnail as string}
						loading='lazy'
						fallback={record?.image?.original}
						alt={record?.name}
						preview={false}
						className='cosmetics-logo'
					/>
				) : (
					<div className={'cosmetics-logo'} />
				)
		}
	]

	const formClass = cx({
		'w-2/3 xl:w-1/2': visibleForm
	})

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={cosmetics?.isLoading}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={24}>
						<div className='content-body'>
							<CosmeticsFilter
								total={cosmetics?.data?.length}
								onSubmit={(values: any) => setQuery({ ...query, search: values.search })}
								addButton={
									<Button
										onClick={() => {
											dispatch(initialize(FORM.COSMETIC, {}))
											changeFormVisibility(true)
										}}
										type='primary'
										htmlType='button'
										className={'noti-btn'}
										icon={<PlusIcon />}
									>
										{STRINGS(t).addRecord(t('loc:kozmetiku'))}
									</Button>
								}
							/>
							<div className={'w-full flex'}>
								<div className={formClass}>
									<CustomTable
										className='table-fixed'
										columns={columns}
										dataSource={tableData}
										rowClassName={'clickable-row'}
										twoToneRows
										onChange={onChangeTable}
										pagination={false}
										onRow={(record) => ({
											onClick: () => changeFormVisibility(true, record)
										})}
										loading={cosmetics.isLoading}
									/>
								</div>
								{visibleForm ? (
									<div className={'w-6/12 flex justify-around items-start'}>
										<Divider className={'h-full'} type={'vertical'} />
										<CosmeticForm
											closeForm={changeFormVisibility}
											cosmeticID={cosmeticID}
											onSubmit={handleSubmit}
											onDelete={handleDelete}
											usedBrands={cosmetics.data?.map((item) => item.name)}
										/>
									</div>
								) : undefined}
							</div>
						</div>
					</Col>
				</Row>
			</Spin>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(CosmeticsPage)
