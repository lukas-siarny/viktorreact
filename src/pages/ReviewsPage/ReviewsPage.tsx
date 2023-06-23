import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Rate, Progress, Button, Dropdown } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'
import { isNil } from 'lodash'
import cx from 'classnames'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ReviewsFilter from './components/ReviewsFilter'
import DeleteButton from '../../components/DeleteButton'
import TabsComponent from '../../components/TabsComponent'

// utils
import { ADMIN_PERMISSIONS, FORM, PERMISSION, REVIEWS_TAB_KEYS, REVIEW_VERIFICATION_STATUS, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, formFieldID, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { deleteReq, patchReq } from '../../utils/request'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getReviews } from '../../reducers/reviews/reviewsActions'
import { setSelectedCountry } from '../../reducers/selectedCountry/selectedCountryActions'

// types
import { IBreadcrumbs, Columns } from '../../types/interfaces'

// assets
import { ReactComponent as EyeoffIcon } from '../../assets/icons/eye-hidden-icon.svg'
import { ReactComponent as EyeIcon } from '../../assets/icons/eye-icon.svg'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { reviewsPageURLQueryParams } from '../../schemas/queryParams'
import { IReviewFilterForm } from '../../schemas/review'

const getRowId = (verificationStatus: string, id: string) => `${verificationStatus}_${id}`

const ReviewsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)

	const [query, setQuery] = useQueryParams(reviewsPageURLQueryParams, {
		page: 1,
		order: 'toxicityScore:desc',
		reviewState: REVIEWS_TAB_KEYS.PUBLISHED
	})

	const reviews = useSelector((state: RootState) => state.reviews.reviews)

	const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)

	const isLoading = isSubmitting || reviews?.isLoading

	const fetchReviews = useCallback(async () => {
		const { data } = await dispatch(
			getReviews({
				page: query.page,
				limit: query.limit,
				order: query.order,
				search: query.search,
				deleted: query.reviewState === REVIEWS_TAB_KEYS.DELETED,
				verificationStatus: query.verificationStatus as REVIEW_VERIFICATION_STATUS,
				toxicityScoreFrom: query.toxicityScoreFrom,
				toxicityScoreTo: query.toxicityScoreTo,
				salonCountryCode: query.salonCountryCode || selectedCountry
			})
		)
		if (data) {
			setExpandedRowKeys(data.reviews.map((review) => getRowId(review.verificationStatus, review.id)))
		}
	}, [
		dispatch,
		query.page,
		query.limit,
		query.order,
		query.search,
		query.reviewState,
		query.verificationStatus,
		query.toxicityScoreFrom,
		query.toxicityScoreTo,
		query.salonCountryCode,
		selectedCountry
	])

	useEffect(() => {
		dispatch(
			initialize(FORM.REVIEWS_FILTER, {
				search: query.search,
				verificationStatus: query.verificationStatus as REVIEW_VERIFICATION_STATUS,
				toxicityScoreFrom: query.toxicityScoreFrom,
				toxicityScoreTo: query.toxicityScoreTo,
				salonCountryCode: query.salonCountryCode || selectedCountry
			})
		)
		fetchReviews()
	}, [dispatch, query.search, fetchReviews, query.toxicityScoreFrom, query.toxicityScoreTo, query.verificationStatus, query.salonCountryCode, selectedCountry])

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
			page: limit === reviews?.data?.pagination?.limit ? page : 1
		}
		setQuery(newQuery)
	}

	const handleSubmit = (values: IReviewFilterForm) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		// update selected country globally based on filter
		dispatch(setSelectedCountry(values?.salonCountryCode))
		setQuery(newQuery)
	}

	const onTabChange = (selectedTabKey: string) => {
		setQuery({ ...query, page: 1, reviewState: selectedTabKey as REVIEWS_TAB_KEYS })
	}

	const deleteReview = async (reviewID: string) => {
		if (isSubmitting) {
			return
		}
		try {
			setIsSubmitting(true)
			await deleteReq('/api/b2b/admin/reviews/{reviewID}', { reviewID })
			fetchReviews()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	const changeVerificationStatus = async (reviewID: string, verificationStatus: REVIEW_VERIFICATION_STATUS) => {
		if (isSubmitting) {
			return
		}
		try {
			setIsSubmitting(true)
			await patchReq('/api/b2b/admin/reviews/{reviewID}/verification', { reviewID }, { verificationStatus })
			fetchReviews()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	const getColumns = () => {
		const columns: Columns = [
			{
				title: t('loc:Autor recenzie'),
				dataIndex: 'reviewerName',
				key: 'reviewerName',
				ellipsis: true,
				width: '20%',
				render: (value) => value || '-'
			},
			{
				title: t('loc:Dátum a čas vytvorenia'),
				dataIndex: 'createdAt',
				key: 'createdAt',
				ellipsis: true,
				width: '20%',
				render: (value) => (value ? formatDateByLocale(value) : '-')
			},
			{
				title: t('loc:Salón'),
				dataIndex: 'salon',
				key: 'salon',
				ellipsis: true,
				width: '20%',
				render: (value) => {
					return value?.name || '-'
				}
			},
			{
				title: t('loc:Recenzovaný kolega'),
				dataIndex: 'calendarEvent',
				key: 'calendarEvent',
				ellipsis: true,
				width: '20%',
				render: (value) => value?.employee?.fullName || '-'
			},
			{
				title: t('loc:Hodnotenie'),
				dataIndex: 'rating',
				key: 'rating',
				ellipsis: true,
				width: 170,
				render: (value) => <Rate disabled defaultValue={value} count={5} />
			},
			{
				title: t('loc:Toxicita'),
				dataIndex: 'toxicityScore',
				key: 'toxicityScore',
				ellipsis: true,
				width: 170,
				sorter: true,
				sortOrder: setOrder(query.order, 'toxicityScore'),
				render: (value) =>
					!isNil(value) ? (
						<Row wrap={false}>
							<span className={'flex-shrink-0 mr-1 w-13'}>{value ? `${value}%` : ''}</span>
							<Progress percent={value} showInfo={false} strokeColor={'#000'} />
						</Row>
					) : null
			}
		]

		if (query.reviewState === REVIEWS_TAB_KEYS.PUBLISHED) {
			columns.push({
				key: 'actions',
				ellipsis: true,
				fixed: 'right',
				width: 190,
				render: (_value, record) => {
					const disabledShowReview = record?.verificationStatus === REVIEW_VERIFICATION_STATUS.VISIBLE_IN_B2C
					const disabledHideReview = record?.verificationStatus === REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C
					const showReviewText = record?.verificationStatus === REVIEW_VERIFICATION_STATUS.NOT_VERIFIED ? t('loc:Akceptovať text') : t('loc:Publikovať text')
					const dropdownItemClassName = 'p-2 min-w-0 h-9 w-full whitespace-nowrap'

					return (
						<div className={'flex justify-center items-center gap-2 p-1'}>
							<Permissions
								allowed={[...ADMIN_PERMISSIONS, PERMISSION.REVIEW_VERIFY]}
								render={(hasPermission, { openForbiddenModal }) => (
									<Dropdown
										key={'footer-checkout-dropdown'}
										menu={{
											className: 'shadow-md max-w-xs min-w-52 mt-1 p-2 flex flex-col gap-2',
											items: [
												{
													key: 'visible_in_b2c',
													label: showReviewText,
													icon: <EyeIcon />,
													className: cx(dropdownItemClassName, {
														'moderate-accept-message': record?.verificationStatus === REVIEW_VERIFICATION_STATUS.NOT_VERIFIED,
														'moderate-publish-message': record?.verificationStatus !== REVIEW_VERIFICATION_STATUS.NOT_VERIFIED
													}),
													disabled: disabledShowReview,
													onClick: (menuInfo) => {
														if (!hasPermission) {
															menuInfo.domEvent.preventDefault()
															openForbiddenModal()
														} else {
															changeVerificationStatus(record.id, REVIEW_VERIFICATION_STATUS.VISIBLE_IN_B2C)
														}
													}
												},
												{
													key: 'hidden_in_b2c',
													label: t('loc:Skryť text'),
													icon: <EyeoffIcon />,
													className: cx(dropdownItemClassName, 'moderate-hide-message'),
													disabled: disabledHideReview,
													onClick: (menuInfo) => {
														if (!hasPermission) {
															menuInfo.domEvent.preventDefault()
															openForbiddenModal()
														} else {
															changeVerificationStatus(record.id, REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C)
														}
													}
												}
											]
										}}
										placement='bottomRight'
										trigger={['click']}
									>
										<Button
											type={'primary'}
											htmlType={'button'}
											size={'middle'}
											className={'noti-btn h-8 w-32 hover:shadow-none'}
											onClick={(e) => e.preventDefault()}
											id={formFieldID('moderate_btn', record.id)}
										>
											{t('loc:Moderovať')}
										</Button>
									</Dropdown>
								)}
							/>
							<Permissions
								allowed={[...ADMIN_PERMISSIONS, PERMISSION.REVIEW_DELETE]}
								render={(hasPermission, { openForbiddenModal }) => (
									<DeleteButton
										onConfirm={(e) => {
											if (!hasPermission) {
												e?.preventDefault()
												openForbiddenModal()
											} else {
												deleteReview(record.id)
											}
										}}
										smallIcon
										type={'default'}
										entityName={t('loc:recenziu')}
										onlyIcon
										id={formFieldID('delete_btn', record.id)}
									/>
								)}
							/>
						</div>
					)
				}
			})
		}

		return columns
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam recenzií')
			}
		]
	}

	const tabContent = [
		{
			key: REVIEWS_TAB_KEYS.PUBLISHED,
			tabKey: REVIEWS_TAB_KEYS.PUBLISHED,
			label: t('loc:Publikované')
		},
		{
			key: REVIEWS_TAB_KEYS.DELETED,
			tabKey: REVIEWS_TAB_KEYS.DELETED,
			label: t('loc:Vymazané')
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent className={'box-tab'} activeKey={query.reviewState} onChange={onTabChange} items={tabContent} destroyInactiveTabPane />
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={isLoading}>
							<ReviewsFilter onSubmit={handleSubmit} />
							<CustomTable
								className='table-fixed table-expandable'
								onChange={onChangeTable}
								columns={getColumns()}
								dataSource={reviews?.data?.reviews}
								rowKey={(record) => getRowId(record.verificationStatus, record.id)}
								scroll={{ x: 1000 }}
								twoToneRows
								onRow={(record) => ({
									className: record.verificationStatus === REVIEW_VERIFICATION_STATUS.NOT_VERIFIED ? 'noti-table-row-warning' : undefined
								})}
								expandable={{
									expandedRowRender: (record) => {
										return (
											<p
												className={cx('pb-1 pl-4 whitespace-pre-wrap flex-1', {
													'text-notino-gray': record.verificationStatus === REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C
												})}
											>
												<i>{record.reviewMessage || '-'}</i>
											</p>
										)
									},
									showExpandColumn: false,
									defaultExpandAllRows: true,
									expandedRowKeys
								}}
								useCustomPagination
								pagination={{
									pageSize: reviews?.data?.pagination?.limit,
									total: reviews?.data?.pagination?.totalCount,
									current: reviews?.data?.pagination?.page,
									onChange: onChangePagination,
									disabled: reviews?.isLoading
								}}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([...ADMIN_PERMISSIONS, PERMISSION.REVIEW_READ]))(ReviewsPage)
