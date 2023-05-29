import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Input, Row } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { getFormValues } from 'redux-form'
import { ColumnsType } from 'antd/lib/table'
import { useNavigate } from 'react-router'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ImportForm from '../../components/ImportForm'
import { IHeaderCountryForm } from '../../components/HeaderSelectCountryForm'
import FlagIcon from '../../components/FlagIcon'

// utils
import { ADMIN_PERMISSIONS, ASSET_TYPE, FORM, IMPORT_TYPE, PAGINATION, REQUEST_STATUS, ROW_GUTTER_X_DEFAULT, UPLOAD_IMG_CATEGORIES } from '../../utils/enums'
import { formatDateByLocale, getLinkWithEncodedBackUrl, normalizeDirectionKeys } from '../../utils/helper'
import { postReq } from '../../utils/request'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { getDocuments } from '../../reducers/documents/documentActions'

// types
import { Columns, IBreadcrumbs } from '../../types/interfaces'
import { RootState } from '../../reducers'

// assets
import { ReactComponent as UploadIcon } from '../../assets/icons/upload-icon.svg'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schemas
import { documentsPageURLQueryParamsSchema } from '../../schemas/queryParams'

const DocumentsPage = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const navigate = useNavigate()
	const documents = useSelector((state: RootState) => state.documents.documents)

	const [query, setQuery] = useQueryParams(documentsPageURLQueryParamsSchema, {
		page: 1,
		limit: PAGINATION.limit
	})

	const countryFormValues: Partial<IHeaderCountryForm> = useSelector((state: RootState) => getFormValues(FORM.HEADER_COUNTRY_FORM)(state))
	const [uploadStatus, setRequestStatus] = useState<REQUEST_STATUS | undefined>(undefined)
	const [fileUploadVisible, setFileUploadVisible] = useState<ASSET_TYPE>()
	const isLoading = documents?.isLoading
	const [message, setMessage] = useState('')

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
		dispatch(getDocuments(query))
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
						<FlagIcon countryCode={record.countryCode.toLowerCase()} />
						<span>{value}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Dátum poslednej aktualizácie'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			render: (value) => (value ? formatDateByLocale(value) : '-')
		}
	]

	const actions: ColumnsType<any> = [
		{
			dataIndex: '',
			align: 'right',
			className: 'ignore-cell-click',
			render(val, record) {
				return (
					<Button
						onClick={(e) => {
							e.stopPropagation()
							setFileUploadVisible(record.assetType.key)
						}}
						// disabled={disabled}
						type='primary'
						htmlType='button'
						className={'noti-btn mr-2'}
						icon={<UploadIcon />}
					>
						{t('loc:Aktualizovať súbor')}
					</Button>
				)
			}
		}
	]

	const cols = [...columns, ...actions]

	const fileUploadSubmit = async (values: any) => {
		setRequestStatus(REQUEST_STATUS.SUBMITTING)
		try {
			const { data } = await postReq('/api/b2b/admin/files/sign-urls', undefined, {
				files: [
					{
						name: values?.file.name,
						size: values?.file.size,
						mimeType: values?.file.type
					}
				],
				category: UPLOAD_IMG_CATEGORIES.ASSET_DOC_TYPE
			})
			if (countryFormValues.countryCode && !!fileUploadVisible) {
				const fileIDs = data?.files?.map((file) => file.id)
				postReq('/api/b2b/admin/documents/', undefined, {
					countryCode: countryFormValues.countryCode,
					fileIDs: fileIDs as any,
					message: message || null,
					assetType: fileUploadVisible
				})
				setRequestStatus(REQUEST_STATUS.SUCCESS)
			}
			setFileUploadVisible(undefined)
		} catch {
			setRequestStatus(REQUEST_STATUS.ERROR)
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
						<ImportForm
							setRequestStatus={setRequestStatus}
							requestStatus={uploadStatus}
							type={IMPORT_TYPE.UPLOAD}
							label={t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.pdf' })}
							accept={'.pdf'}
							title={t('loc:Nahrať dokument')}
							visible={!!fileUploadVisible}
							setVisible={setFileUploadVisible}
							onSubmit={fileUploadSubmit}
							extraContent={
								<div className={'flex items-center justify-between gap-1'}>
									<div className={'ant-form-item w-full'}>
										<label htmlFor={'noti-message-input'} className={'block mb-2'}>
											{t('loc:Sprievodná správa')}
										</label>
										<Input.TextArea
											id={'noti-message-input'}
											style={{ zIndex: 999 }}
											className={'noti-input w-full mb-4'}
											size={'large'}
											onChange={(e) => setMessage(e.target.value)}
											value={message}
											placeholder={t('loc:Zadajte sprievodnú správu')}
										/>
									</div>
								</div>
							}
						/>

						<CustomTable
							className='table-fixed table-expandable'
							onChange={onChangeTable}
							columns={cols}
							rowClassName={'clickable-row'}
							loading={isLoading}
							dataSource={documents.tableData}
							twoToneRows
							onRow={(record) => ({
								onClick: () => navigate(getLinkWithEncodedBackUrl(t('paths:documents/{{assetType}}', { assetType: record.assetType.key })))
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
