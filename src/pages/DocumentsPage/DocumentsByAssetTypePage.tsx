import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Modal, Row, Spin, Input } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { getFormValues } from 'redux-form'
import { ColumnsType } from 'antd/lib/table'

// components
import { useParams } from 'react-router-dom'
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ImportForm from '../../components/ImportForm'
import HeaderSelectCountryForm, { IHeaderCountryForm } from '../../components/HeaderSelectCountryForm'

// utils
import { ADMIN_PERMISSIONS, ASSET_TYPE, FORM, IMPORT_TYPE, PAGINATION, REQUEST_STATUS, ROW_GUTTER_X_DEFAULT, UPLOAD_IMG_CATEGORIES } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys } from '../../utils/helper'
import { postReq } from '../../utils/request'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'

// types
import { Columns, IBreadcrumbs } from '../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'
import { ReactComponent as UploadIcon } from '../../assets/icons/upload-icon.svg'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// redux
import { setSelectedCountry } from '../../reducers/selectedCountry/selectedCountryActions'
import { getDocumentsByAssetType } from '../../reducers/documents/documentActions'

// schemas
import { documentsPageURLQueryParamsSchema } from '../../schemas/queryParams'
import useBackUrl from '../../hooks/useBackUrl'

const DocumentsByAssetTypePage = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const { assetType } = useParams<Required<{ assetType: ASSET_TYPE }>>()
	// TODO: logika na otvorenie modalu so selectom krajiny ak nie je picknuta
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	// TODO: dokumenty
	const documentsByAssetType = useSelector((state: RootState) => state.documents.documentsByAssetType)
	const [query, setQuery] = useQueryParams(documentsPageURLQueryParamsSchema, {
		page: 1,
		limit: PAGINATION.limit
	})

	const countryFormValues: Partial<IHeaderCountryForm> = useSelector((state: RootState) => getFormValues(FORM.HEADER_COUNTRY_FORM)(state))
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [visible, setVisible] = useState(!selectedCountry)
	const [uploadStatus, setRequestStatus] = useState<REQUEST_STATUS | undefined>(undefined)
	const [fileUploadVisible, setFileUploadVisible] = useState<ASSET_TYPE>()
	const isLoading = isSubmitting || documentsByAssetType?.isLoading
	const [message, setMessage] = useState('')
	const [backUrl] = useBackUrl(t('paths:documents'))

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Prehľad dokumentov'),
				link: backUrl
			},
			{
				name: t('loc:Prehľad dokumentov podľa typu')
			}
		]
	}

	const fetchDocuments = useCallback(async () => {
		// TODO: get action
	}, [dispatch, selectedCountry])

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

	console.log('assetType', assetType)
	console.log('selectedCountry', selectedCountry)
	useEffect(() => {
		if (assetType && selectedCountry) {
			dispatch(getDocumentsByAssetType({ ...query, countryCode: selectedCountry, assetType }))
		}
	}, [assetType, dispatch, query, selectedCountry])

	const columns: Columns = [
		{
			title: t('loc:Názov typu dokumentu'),
			dataIndex: ['assetType', 'name'],
			key: 'name',
			ellipsis: true,
			render: (value) => value || '-'
		},
		{
			// TODO: BE musi dorobit
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
			align: 'center',
			className: 'ignore-cell-click',
			render(val, record) {
				return (
					<div>
						<Button
							onClick={() => setFileUploadVisible(record.assetType.key)}
							// disabled={disabled}
							type='primary'
							htmlType='button'
							className={'noti-btn mr-2'}
							icon={<UploadIcon />}
						>
							{t('loc:Aktualizovať súbor')}
						</Button>
					</div>
				)
			}
		}
	]

	const cols = [...columns, ...actions]

	const modals = (
		<Modal
			className='rounded-fields'
			title={t('loc:Vyberte krajinu')}
			centered
			open={visible}
			footer={null}
			onCancel={countryFormValues.countryCode ? () => setVisible(false) : undefined}
			closeIcon={<CloseIcon />}
			width={394}
		>
			<HeaderSelectCountryForm required onSubmit={(data: IHeaderCountryForm) => dispatch(setSelectedCountry(data.countryCode))} />
		</Modal>
	)
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
			{modals}
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:documents')} />
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
						<Spin spinning={isLoading}>
							<CustomTable
								className='table-fixed table-expandable'
								onChange={onChangeTable}
								columns={cols}
								dataSource={documentsByAssetType.tableData}
								// rowKey={(record) => getRowId(record.verificationStatus, record.id)}
								twoToneRows
								pagination={{
									pageSize: documentsByAssetType?.data?.pagination?.limit,
									total: documentsByAssetType?.data?.pagination?.totalCount,
									current: documentsByAssetType?.data?.pagination?.page,
									onChange: onChangePagination,
									disabled: documentsByAssetType?.isLoading
								}}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}
export default compose(withPermissions([...ADMIN_PERMISSIONS]))(DocumentsByAssetTypePage)
