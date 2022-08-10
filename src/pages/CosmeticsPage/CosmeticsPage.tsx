import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, Image } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize, reset } from 'redux-form'
import { get } from 'lodash'
import cx from 'classnames'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import CosmeticForm from './components/CosmeticForm'
import CosmeticsFilter from './components/CosmeticsFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { transformToLowerCaseWithoutAccent } from '../../utils/helper'

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
	const [filterQuery, setFilterQuery] = useState<string | undefined>(undefined)
	// 0 - represents new record
	const [cosmeticID, setCosmeticID] = useState<number>(0)

	const cosmetics = useSelector((state: RootState) => state.cosmetics.cosmetics)

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

	const tableData = useMemo(() => {
		if (!cosmetics || !cosmetics.data) {
			return []
		}

		const source = filterQuery
			? cosmetics.data.filter((cosmetic) => {
					const name = transformToLowerCaseWithoutAccent(cosmetic.name)
					const query = transformToLowerCaseWithoutAccent(filterQuery)
					return name.includes(query)
			  })
			: cosmetics.data

		// transform to table data
		return source.map((cosmetic) => ({
			...cosmetic,
			key: cosmetic.id
		}))
	}, [filterQuery, cosmetics])

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
			title: t('loc:Logo'),
			dataIndex: 'image',
			key: 'image',
			render: (value, record) => (
				<Image
					src={record?.image?.resizedImages.thumbnail as string}
					loading='lazy'
					fallback={record?.image?.original}
					alt={record?.name}
					preview={false}
					className='cosmetics-logo'
				/>
			)
		},
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
			render: (value) => <span className='base-regular'>{value}</span>
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
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={cosmetics?.isLoading}>
							<CosmeticsFilter
								total={cosmetics?.data?.length}
								onSubmit={(query: any) => setFilterQuery(query.search)}
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
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(CosmeticsPage)
