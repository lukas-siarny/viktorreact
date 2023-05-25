import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Modal, Row, Select, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import cx from 'classnames'

// components
import { getFormValues } from 'redux-form'
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { ADMIN_PERMISSIONS, FORM, PAGINATION, PERMISSION, REQUEST_STATUS, REVIEW_VERIFICATION_STATUS, ROW_GUTTER_X_DEFAULT, TEMPLATE_OPTIONS_CUSTOMERS } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys } from '../../utils/helper'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'

// types
import { Columns, IBreadcrumbs, IDataUploadForm } from '../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

// hooks
import HeaderSelectCountryForm, { IHeaderCountryForm } from '../../components/HeaderSelectCountryForm'
import { setSelectedCountry } from '../../reducers/selectedCountry/selectedCountryActions'
import { getDocuments } from '../../reducers/documents/documentActions'
import useQueryParams from '../../hooks/useQueryParamsZod'
import { documentsPageURLQueryParamsSchema, IDocumentsPageURLQueryParams } from '../../schemas/queryParams'
import ImportForm from '../../components/ImportForm'
import { postReq } from '../../utils/request'

const getRowId = (verificationStatus: string, id: string) => `${verificationStatus}_${id}`

const DocumentsPage = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	// TODO: logika na otvorenie modalu so selectom krajiny ak nie je picknuta
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	// TODO: dokumenty
	const documents = useSelector((state: RootState) => state.documents.documents)
	console.log('documents', documents)
	const [query, setQuery] = useQueryParams(documentsPageURLQueryParamsSchema, {
		page: PAGINATION.defaultPageSize,
		limit: PAGINATION.limit
	})

	const countryFormValues: Partial<IHeaderCountryForm> = useSelector((state: RootState) => getFormValues(FORM.HEADER_COUNTRY_FORM)(state))
	// console.log('countryFormValues', countryFormValues.countryCode)
	const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)

	const isLoading = isSubmitting || documents?.isLoading

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

	useEffect(() => {
		dispatch(getDocuments(query))
	}, [dispatch, query])

	// Delete document
	// const deleteReview = async (reviewID: string) => {
	// 	if (isSubmitting) {
	// 		return
	// 	}
	// 	try {
	// 		setIsSubmitting(true)
	// 		await deleteReq('/api/b2b/admin/reviews/{reviewID}', { reviewID })
	// 		fetchDocuments()
	// 	} catch (error: any) {
	// 		// eslint-disable-next-line no-console
	// 		console.error(error.message)
	// 	} finally {
	// 		setIsSubmitting(false)
	// 	}
	// }

	const getColumns = () => {
		const columns: Columns = [
			{
				title: t('loc:Názov typu dokumentu'),
				dataIndex: 'name',
				key: 'name',
				ellipsis: true,
				render: (value) => value || '-'
			},
			{
				title: t('loc:Dátum poslednej aktualizácie'),
				dataIndex: 'updatedAt',
				key: 'updatedAt',
				ellipsis: true,
				render: (value) => (value ? formatDateByLocale(value) : '-')
			}
		]

		return columns
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Prehľad dokumentov')
			}
		]
	}
	const [visible, setVisible] = useState(!selectedCountry)
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
	const [uploadStatus, setRequestStatus] = useState<REQUEST_STATUS | undefined>(undefined)
	const [fileUploadVisible, setFileUploadVisible] = useState(false)
	const fileUploadSubmit = async (values: any) => {
		setRequestStatus(REQUEST_STATUS.SUBMITTING)
		console.log('values', values)
		const formData = new FormData()
		formData.append('file', values?.file)
		console.log('formData', formData)
		try {
			await postReq(
				'/api/b2b/admin/documents/',
				undefined,
				{
					fileIDs: [values.file.uid],
					message: 'test',
					countryCode: 'SK',
					assetType: 'B2B_APP_TERMS_CONDITIONS'
				},
				{
					// headers: {
					// 	'Content-Type': 'multipart/form-data'
					// }
				}
			)

			setRequestStatus(REQUEST_STATUS.SUCCESS)
		} catch {
			setRequestStatus(REQUEST_STATUS.ERROR)
		}
	}

	return (
		<>
			{modals}
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body small'>
						<ImportForm
							setRequestStatus={setRequestStatus}
							requestStatus={uploadStatus}
							label={t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.pdf' })}
							accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.pdf'}
							title={t('loc:Importovať zákazníkov')}
							visible={fileUploadVisible}
							setVisible={setFileUploadVisible}
							onSubmit={fileUploadSubmit}
							// extraContent={
							// 	<>
							// 		<Divider className={'mt-1 mb-3'} />
							// 		<div className={'flex items-center justify-between gap-1'}>
							// 			<div className={'ant-form-item w-full'}>
							// 				<label htmlFor={'noti-customer-template-select'} className={'block mb-2'}>
							// 					{t('loc:Vzorové šablóny súborov')}
							// 				</label>
							// 				<Select
							// 					id={'noti-customer-template-select'}
							// 					className={'noti-select-input w-full mb-4'}
							// 					size={'large'}
							// 					labelInValue
							// 					options={TEMPLATE_OPTIONS_CUSTOMERS()}
							// 					onChange={(val: any) => setTemplateValue(val)}
							// 					value={templateValue}
							// 					placeholder={t('loc:Vyberte šablónu na stiahnutie')}
							// 					getPopupContainer={(node) => node.closest('.ant-modal-body') as HTMLElement}
							// 				/>
							// 			</div>
							// 			<Button
							// 				className={'noti-btn'}
							// 				href={`${process.env.PUBLIC_URL}/templates/${templateValue?.value}`}
							// 				target='_blank'
							// 				rel='noopener noreferrer'
							// 				type={'default'}
							// 				disabled={!templateValue}
							// 				htmlType={'button'}
							// 				download
							// 			>
							// 				<div>{t('loc:Stiahnuť')}</div>
							// 			</Button>
							// 		</div>
							// 	</>
							// }
						/>

						<Spin spinning={isLoading}>
							<Button
								onClick={() => setFileUploadVisible(true)}
								// disabled={disabled}
								type='primary'
								htmlType='button'
								className={'noti-btn mr-2'}
								// icon={<UploadIcon />}
							>
								{t('loc:Nahrať súbor')}
							</Button>

							{/* <CustomTable */}
							{/*	className='table-fixed table-expandable' */}
							{/*	onChange={onChangeTable} */}
							{/*	columns={getColumns()} */}
							{/*	dataSource={documents.data.documents} */}
							{/*	// rowKey={(record) => getRowId(record.verificationStatus, record.id)} */}
							{/*	twoToneRows */}
							{/*	// TODO: napatovat na backend */}
							{/*	// pagination={{ */}
							{/*	// 	pageSize: reviews?.data?.pagination?.limit, */}
							{/*	// 	total: reviews?.data?.pagination?.totalCount, */}
							{/*	// 	current: reviews?.data?.pagination?.page, */}
							{/*	// 	onChange: onChangePagination, */}
							{/*	// 	disabled: reviews?.isLoading */}
							{/*	// }} */}
							{/* /> */}
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}
// TODO: sprait opravnenia
export default compose(withPermissions([...ADMIN_PERMISSIONS]))(DocumentsPage)
