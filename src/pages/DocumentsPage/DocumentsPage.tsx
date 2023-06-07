import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { ColumnsType } from 'antd/lib/table'
import { useNavigate } from 'react-router'
import { initialize } from 'redux-form'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import FlagIcon from '../../components/FlagIcon'
import DocumentsFilter from './components/DocumentsFilter'
import DocumentsForm from './components/DocumentsForm'

// utils
import { ADMIN_PERMISSIONS, FORM, PAGINATION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys } from '../../utils/helper'
import { postReq } from '../../utils/request'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { getAssetTypes, getDocuments } from '../../reducers/documents/documentActions'

// types
import { Columns, IBreadcrumbs, IDocumentsFilter } from '../../types/interfaces'
import { RootState } from '../../reducers'

// assets
import { ReactComponent as UploadIcon } from '../../assets/icons/upload-icon.svg'

// hooks
import useQueryParams, { formatObjToQuery } from '../../hooks/useQueryParamsZod'

// schemas
import { documentsPageURLQueryParamsSchema, IDocumentsAssetTypesPageURLQueryParams } from '../../schemas/queryParams'
import { IDocumentForm } from '../../schemas/document'

const DocumentsPage = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const navigate = useNavigate()
	const documents = useSelector((state: RootState) => state.documents.documents)
	const [visible, setVisible] = useState(false)
	const isLoading = documents?.isLoading

	const [query, setQuery] = useQueryParams(documentsPageURLQueryParamsSchema, {
		page: 1,
		limit: PAGINATION.limit,
		languageCode: undefined,
		assetType: undefined
	})

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Prehľad dokumentov')
			}
		]
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

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page
		}
		setQuery(newQuery)
	}

	useEffect(() => {
		dispatch(getAssetTypes())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		dispatch(getDocuments(query))
		dispatch(
			initialize(FORM.DOCUMENTS_FILTER, {
				assetType: query.assetType,
				languageCode: query.languageCode
			})
		)
	}, [dispatch, query])

	const columns: Columns = [
		{
			title: t('loc:Názov typu dokumentu'),
			dataIndex: ['assetType', 'name'],
			key: 'name',
			ellipsis: true,
			render: (value, record) => {
				return (
					<div className={'flex items-center'}>
						<FlagIcon countryCode={record.languageCode?.toLowerCase()} />
						<span className={'truncate'}>{value}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Dátum poslednej aktualizácie'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '20%',
			ellipsis: true,
			render: (value) => (value ? formatDateByLocale(value) : '-')
		}
	]

	const actions: ColumnsType<any> = [
		{
			dataIndex: '',
			align: 'right',
			width: '160px',
			render(val, record) {
				return (
					<Button
						onClick={(e) => {
							e.stopPropagation()
							setVisible(true)
							dispatch(
								initialize(FORM.DOCUMENTS_FORM, {
									assetType: record.assetType.key,
									languageCode: record.languageCode,
									id: record.id
								})
							)
						}}
						type='primary'
						htmlType='button'
						size={'small'}
						className={'noti-btn'}
						icon={<UploadIcon className={'w-4 h-4'} />}
					>
						<span className={'pl-4'}>{t('loc:Aktualizovať súbor')}</span>
					</Button>
				)
			}
		}
	]

	const cols = [...columns, ...actions]

	const fileUploadSubmit = async (values: IDocumentForm) => {
		try {
			const fileIDs = values?.files?.map((item) => item.id)
			await postReq('/api/b2b/admin/documents/', undefined, {
				languageCode: values?.languageCode as any,
				fileIDs: fileIDs as any,
				message: values?.message || null,
				assetType: values?.assetType
			})
			setVisible(false)
			dispatch(getDocuments(query))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	const handleSubmit = (values: IDocumentsFilter) => {
		const newQuery = {
			...query,
			...values,
			languageCode: values?.languageCode?.toLowerCase(),
			page: 1
		}
		setQuery(newQuery)
	}
	const handleCreateDocument = () => {
		setVisible(true)
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body small'>
						<DocumentsForm visible={visible} setVisible={setVisible} onSubmit={fileUploadSubmit} />
						{/* <ImportForm */}
						{/*	setRequestStatus={setRequestStatus} */}
						{/*	requestStatus={uploadStatus} */}
						{/*	type={IMPORT_TYPE.UPLOAD} */}
						{/*	label={t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.pdf' })} */}
						{/*	accept={'.pdf'} */}
						{/*	title={t('loc:Nahrať dokument')} */}
						{/*	visible={!!fileUploadVisible} */}
						{/*	setVisible={setFileUploadVisible} */}
						{/*	onSubmit={fileUploadSubmit} */}
						{/*	extraContent={ */}
						{/*		<div className={''}> */}
						{/*			<div className={'ant-form-item w-full'}> */}
						{/*				<label htmlFor={'noti-message-input'} className={'block mb-2'}> */}
						{/*					{t('loc:Sprievodná správa')} */}
						{/*				</label> */}
						{/*				<Input.TextArea */}
						{/*					maxLength={VALIDATION_MAX_LENGTH.LENGTH_255} */}
						{/*					id={'noti-message-input'} */}
						{/*					className={'noti-input w-full mb-4'} */}
						{/*					size={'large'} */}
						{/*					onChange={(e) => setUploadData({ ...uploadData, message: e.target.value })} */}
						{/*					value={uploadData?.message} */}
						{/*					placeholder={t('loc:Zadajte sprievodnú správu')} */}
						{/*				/> */}
						{/*			</div> */}
						{/*			<div className={'ant-form-item w-full'}> */}
						{/*				<label htmlFor={'noti-template-select'} className={'block mb-2'}> */}
						{/*					{t('loc:Jazyk')} */}
						{/*				</label> */}
						{/*				<Select */}
						{/*					id={'noti-template-select'} */}
						{/*					className={'noti-select-input w-full'} */}
						{/*					size={'large'} */}
						{/*					labelInValue */}
						{/*					loading={countries.isLoading} */}
						{/*					options={countries.enumerationsOptions} */}
						{/*					onChange={(val) => setUploadData({ ...uploadData, languageCode: val })} */}
						{/*					value={uploadData?.languageCode} */}
						{/*					placeholder={t('loc:Vyberte jazyk')} */}
						{/*					getPopupContainer={(node) => node.closest('.ant-modal-body') as HTMLElement} */}
						{/*				/> */}
						{/*			</div> */}
						{/*			<div className={'ant-form-item w-full'}> */}
						{/*				<label htmlFor={'noti-template-select'} className={'block mb-2'}> */}
						{/*					{t('loc:Typ dokumentu')} */}
						{/*				</label> */}
						{/*				<Select */}
						{/*					id={'noti-template-select'} */}
						{/*					className={'noti-select-input w-full'} */}
						{/*					size={'large'} */}
						{/*					labelInValue */}
						{/*					loading={assetTypes.isLoading} */}
						{/*					options={assetTypes.options} */}
						{/*					onChange={(val) => setUploadData({ ...uploadData, assetType: val })} */}
						{/*					value={uploadData?.assetType} */}
						{/*					placeholder={t('loc:Vyberte typ dokumentu')} */}
						{/*					getPopupContainer={(node) => node.closest('.ant-modal-body') as HTMLElement} */}
						{/*				/> */}
						{/*			</div> */}
						{/*		</div> */}
						{/*	} */}
						{/* /> */}
						<DocumentsFilter createDocument={handleCreateDocument} onSubmit={handleSubmit} />
						<CustomTable
							className='table-fixed table-expandable'
							onChange={onChangeTable}
							columns={cols}
							rowClassName={'clickable-row'}
							loading={isLoading}
							dataSource={documents.data?.documents || []}
							twoToneRows
							rowKey='id'
							onRow={(record) => ({
								onClick: () => {
									const redirectQuery: IDocumentsAssetTypesPageURLQueryParams = {
										languageCode: record.languageCode
									}
									navigate({
										pathname: t('paths:documents/{{assetType}}', { assetType: record.assetType.key }),
										search: formatObjToQuery(redirectQuery)
									})
								}
							})}
							pagination={{
								pageSize: documents?.data?.pagination?.limit,
								total: documents?.data?.pagination?.totalCount,
								current: documents?.data?.pagination?.page,
								onChange: onChangePagination,
								disabled: documents?.isLoading
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}
export default compose(withPermissions([...ADMIN_PERMISSIONS]))(DocumentsPage)
