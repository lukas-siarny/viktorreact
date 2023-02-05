import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, Image, TablePaginationConfig } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize, reset } from 'redux-form'
import { get } from 'lodash'
import cx from 'classnames'
import { SorterResult } from 'antd/lib/table/interface'
import { useSearchParams } from 'react-router-dom'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import CosmeticForm from './components/CosmeticForm'
import CosmeticsFilter from './components/CosmeticsFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS, CREATE_BUTTON_ID } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { normalizeDirectionKeys, normalizeSearchQueryParams, setOrder, sortData } from '../../utils/helper'

// reducers
import { getCosmetics } from '../../reducers/cosmetics/cosmeticsActions'
import { RootState } from '../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, ICosmetic, ICosmeticForm, Columns, ISearchFilter } from '../../types/interfaces'

const CosmeticsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)
	// undefined - represents new record
	const [cosmeticID, setCosmeticID] = useState<string | undefined>(undefined)

	const cosmetics = useSelector((state: RootState) => state.cosmetics.cosmetics)

	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		order: 'name:ASC'
	})
	const query = {
		search: searchParams.get('search') || '',
		order: searchParams.get('order') || ''
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam kozmetiky')
			}
		]
	}

	useEffect(() => {
		dispatch(getCosmetics({ search: query.search as string }))
	}, [dispatch, query.search])

	useEffect(() => {
		dispatch(
			initialize(FORM.COSMETICS_FILTER, {
				search: query.search
			})
		)
	}, [dispatch, query.search])

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

		setCosmeticID(cosmetic ? cosmetic.id : undefined)
		setVisibleForm(true)
	}

	const onChangeTable = (_pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...query,
				order
			}
			setSearchParams(newQuery)
		}
	}

	const handleSubmit = async (formData: ICosmeticForm) => {
		const body = {
			name: formData.name,
			imageID: get(formData, 'image[0].id') || get(formData, 'image[0].uid') || null
		}

		try {
			if (cosmeticID) {
				await patchReq('/api/b2b/admin/enums/cosmetics/{cosmeticID}', { cosmeticID }, body)
			} else {
				await postReq('/api/b2b/admin/enums/cosmetics/', null, body)
			}
			dispatch(getCosmetics())
			changeFormVisibility()
			// reset search in case of newly created entity
			if (!cosmeticID && query.search) {
				setSearchParams({ ...query, search: '' })
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleDelete = async () => {
		if (cosmeticID) {
			try {
				await deleteReq('/api/b2b/admin/enums/cosmetics/{cosmeticID}', { cosmeticID })
				dispatch(getCosmetics())
				changeFormVisibility()
			} catch (error: any) {
				// eslint-disable-next-line no-console
				console.error(error.message)
			}
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
				compare: (a, b) => sortData(a.name, b.name)
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
						className='table-preview-image cosmetics-logo'
					/>
				) : (
					<div className={'table-preview-image cosmetics-logo'} />
				)
		}
	]
	const searchSubmit = useCallback(
		(values: ISearchFilter) => {
			const newQuery = {
				...query,
				search: values.search
			}
			setSearchParams(normalizeSearchQueryParams(newQuery))
		},
		[query, setSearchParams]
	)

	const formClass = cx({
		'w-2/3 xl:w-1/2': visibleForm
	})

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={cosmetics?.isLoading}>
							<CosmeticsFilter
								total={cosmetics?.data?.length}
								onSubmit={searchSubmit}
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
										id={`${CREATE_BUTTON_ID}-${FORM.COSMETIC}`}
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
										dataSource={cosmetics.data || []}
										rowClassName={'clickable-row'}
										twoToneRows
										rowKey={'id'}
										onChange={onChangeTable}
										pagination={false}
										onRow={(record) => ({
											onClick: () => changeFormVisibility(true, record)
										})}
									/>
								</div>
								{visibleForm ? (
									<div className={'w-6/12 flex items-start'}>
										<Divider className={'h-full mx-6 xl:mx-9'} type={'vertical'} />
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
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(CosmeticsPage)
