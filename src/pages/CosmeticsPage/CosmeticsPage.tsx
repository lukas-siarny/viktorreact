import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, Image, TablePaginationConfig } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize, reset } from 'redux-form'
import { get } from 'lodash'
import cx from 'classnames'
import { SorterResult } from 'antd/lib/table/interface'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import CosmeticForm from './components/CosmeticForm'
import CosmeticsFilter from './components/CosmeticsFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS, CREATE_BUTTON_ID } from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { formFieldID, normalizeDirectionKeys } from '../../utils/helper'

// reducers
import { getCosmetics } from '../../reducers/cosmetics/cosmeticsActions'
import { RootState } from '../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, ICosmetic, ICosmeticForm, Columns, ISearchFilter } from '../../types/interfaces'
import { cosmeticsPageURLQueryParams } from '../../schemas/queryParams'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

const CosmeticsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)
	// undefined - represents new record
	const [cosmeticID, setCosmeticID] = useState<string | undefined>(undefined)

	const cosmetics = useSelector((state: RootState) => state.cosmetics.cosmetics)

	const [query, setQuery] = useQueryParams(cosmeticsPageURLQueryParams, {
		limit: 25,
		page: 1
	})

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam kozmetiky')
			}
		]
	}

	useEffect(() => {
		dispatch(getCosmetics({ search: query.search, page: query.page, limit: query.limit }))
	}, [dispatch, query.search, query.page, query.limit])

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
			setQuery(newQuery)
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
			// reset search and page in case of newly created entity
			if (!cosmeticID && query.search) {
				setQuery({ ...query, search: '', page: 1 })
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
			render: (value) => <span className='base-regular'>{value}</span>
		},
		{
			title: t('loc:Logo'),
			dataIndex: 'image',
			key: 'image',
			render: (_value, record) =>
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
			setQuery(newQuery)
		},
		[query, setQuery]
	)

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page: limit === query.limit ? page : 1
		}
		setQuery(newQuery)
	}

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
								total={cosmetics?.data?.pagination.totalCount}
								onSubmit={searchSubmit}
								addButton={
									<Permissions
										allowed={[PERMISSION.COSMETIC_EDIT]}
										render={(hasPermission, { openForbiddenModal }) => (
											<Button
												onClick={() => {
													if (hasPermission) {
														dispatch(initialize(FORM.COSMETIC, {}))
														changeFormVisibility(true)
													} else {
														openForbiddenModal()
													}
												}}
												type='primary'
												htmlType='button'
												className={'noti-btn'}
												icon={<PlusIcon />}
												id={formFieldID(FORM.COSMETIC, CREATE_BUTTON_ID)}
											>
												{STRINGS(t).addRecord(t('loc:kozmetiku'))}
											</Button>
										)}
									/>
								}
							/>
							<div className={'w-full flex'}>
								<div className={formClass}>
									<CustomTable
										className='table-fixed'
										columns={columns}
										dataSource={cosmetics.data?.cosmetics || []}
										rowClassName={'clickable-row'}
										twoToneRows
										rowKey={'id'}
										onChange={onChangeTable}
										onRow={(record) => ({
											onClick: () => changeFormVisibility(true, record)
										})}
										useCustomPagination
										pagination={{
											pageSize: query.limit,
											total: cosmetics?.data?.pagination?.totalCount,
											current: cosmetics?.data?.pagination?.page,
											disabled: cosmetics?.isLoading,
											onChange: onChangePagination
										}}
									/>
								</div>
								{visibleForm ? (
									<div className={'w-6/12 flex items-start'}>
										<Divider className={'h-full mx-6 xl:mx-9'} type={'vertical'} />
										<CosmeticForm closeForm={changeFormVisibility} cosmeticID={cosmeticID} onSubmit={handleSubmit} onDelete={handleDelete} />
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

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.COSMETIC_EDIT]))(CosmeticsPage)
