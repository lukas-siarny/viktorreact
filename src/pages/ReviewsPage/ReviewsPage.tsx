import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BooleanParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Row, Spin, Rate, Progress, Tag, Tooltip, Button, Popconfirm } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'
import { isNil } from 'lodash'
import cx from 'classnames'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ReviewsFilter, { IReviewsFilter } from './components/ReviewsFilter'

// utils
import { FORM, NOTIFICATION_TYPE, PERMISSION, REVIEW_VERIFICATION_STATUS, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs, Columns } from '../../types/interfaces'
import { getReviews } from '../../reducers/reviews/reviewsActions'
import salonsReducer from '../../reducers/salons/salonsReducer'
import DeleteButton from '../../components/DeleteButton'

// assets
import { ReactComponent as EyeoffIcon } from '../../assets/icons/eyeoff-24.svg'
import { ReactComponent as BinIcon } from '../../assets/icons/bin-icon.svg'
import { deleteReq, patchReq } from '../../utils/request'
import TabsComponent from '../../components/TabsComponent'

enum TAB_KEYS {
	PUBLISHED = 'published',
	DELETED = 'deleted'
}

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_BROWSING]

const ReviewsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'toxicityScore:DESC'),
		deleted: withDefault(BooleanParam, false),
		toxicityScoreFrom: NumberParam,
		toxicityScoreTo: NumberParam,
		salonCountryCode: StringParam,
		verificationStatus: StringParam
	})

	const reviews = useSelector((state: RootState) => state.reviews.reviews)
	const tabKey = query.deleted ? TAB_KEYS.DELETED : TAB_KEYS.PUBLISHED

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
				deleted: query.deleted,
				verificationStatus: query.verificationStatus as REVIEW_VERIFICATION_STATUS,
				toxicityScoreFrom: query.toxicityScoreFrom,
				toxicityScoreTo: query.toxicityScoreTo,
				salonCountryCode: query.salonCountryCode
			})
		)
		if (data) {
			setExpandedRowKeys(data.reviews.map((review) => review.id))
		}
	}, [
		dispatch,
		query.page,
		query.limit,
		query.order,
		query.search,
		query.deleted,
		query.toxicityScoreFrom,
		query.toxicityScoreTo,
		query.verificationStatus,
		query.salonCountryCode
	])

	useEffect(() => {
		dispatch(
			initialize(FORM.REVIEWS_FILTER, {
				search: query.search,
				verificationStatus: query.verificationStatus as REVIEW_VERIFICATION_STATUS,
				toxicityScoreFrom: query.toxicityScoreFrom,
				toxicityScoreTo: query.toxicityScoreTo,
				salonCountryCode: query.salonCountryCode
			})
		)
		fetchReviews()
	}, [dispatch, query.search, fetchReviews, query.toxicityScoreFrom, query.toxicityScoreTo, query.verificationStatus, query.salonCountryCode])

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

	const handleSubmit = (values: IReviewsFilter) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(newQuery)
	}

	const onTabChange = (selectedTabKey: string) => {
		setQuery({ ...query, deleted: selectedTabKey === TAB_KEYS.DELETED })
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

	const hideReview = async (reviewID: string) => {
		if (isSubmitting) {
			return
		}
		try {
			setIsSubmitting(true)
			await patchReq('/api/b2b/admin/reviews/{reviewID}/verification', { reviewID }, { verificationStatus: REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C })
			fetchReviews()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Autor'),
			dataIndex: 'userName',
			key: 'userName',
			ellipsis: true,
			width: '20%'
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
			width: '15%',
			render: (value) => {
				return value?.name || value?.id || '-'
			}
		},
		{
			title: t('loc:Rating'),
			dataIndex: 'rating',
			key: 'rating',
			ellipsis: true,
			width: '25%',
			render: (value) => <Rate disabled defaultValue={value} count={5} />
		},
		{
			title: t('loc:Toxicita'),
			dataIndex: 'toxicityScore',
			key: 'toxicityScore',
			ellipsis: true,
			width: '15%',
			sorter: true,
			sortOrder: setOrder(query.order, 'toxicityScore'),
			render: (value) =>
				!isNil(value) ? (
					<Row className={'gap-2'} wrap={false}>
						<span className={'w-9 flex-shrink-0'}>{value ? `${value}%` : ''}</span>
						<Progress className='w-4/5' percent={value} showInfo={false} strokeColor={'#000'} />
					</Row>
				) : null
		},
		{
			title: t('loc:Stav recenzie'),
			dataIndex: 'verificationStatus',
			key: 'verificationStatus',
			ellipsis: true,
			width: '15%',
			render: (value) => {
				switch (value) {
					case REVIEW_VERIFICATION_STATUS.VISIBLE_IN_B2C:
						return (
							<Tag className={'noti-tag bg-status-published'}>
								<span>{t('loc:Zverejnená')}</span>
							</Tag>
						)
					case REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C:
						return (
							<Tag className={'noti-tag bg-status-notPublished'}>
								<span>{t('loc:Skrytá')}</span>
							</Tag>
						)
					case REVIEW_VERIFICATION_STATUS.NOT_VERIFIED:
						return (
							<Tag className={'noti-tag bg-status-pending'}>
								<span>{t('loc:Na kontrolu')}</span>
							</Tag>
						)
					default:
						return null
				}
			}
		},
		{
			key: 'actions',
			ellipsis: true,
			width: 90,
			fixed: 'right',
			render: (_value, record) => {
				return (
					<div className={'flex justify-end items-center gap-2'}>
						<Popconfirm
							placement={'top'}
							title={t('loc:Naozaj chcete srkyť recenziu?')}
							okButtonProps={{
								type: 'default',
								className: 'noti-btn'
							}}
							cancelButtonProps={{
								type: 'primary',
								className: 'noti-btn'
							}}
							okText={t('loc:Skryť')}
							onConfirm={() => hideReview(record.id)}
							cancelText={t('loc:Zrušiť')}
						>
							<Button
								htmlType={'button'}
								type={'dashed'}
								icon={<EyeoffIcon width={16} height={16} />}
								className={'noti-btn'}
								onClick={(e) => {
									e.preventDefault()
								}}
							/>
						</Popconfirm>

						<DeleteButton
							onConfirm={() => {
								deleteReview(record.id)
							}}
							smallIcon
							type={'default'}
							entityName={t('loc:recenziu')}
							onlyIcon
						/>
					</div>
				)
			}
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam recenzií')
			}
		]
	}

	const tabContent = [
		{
			tabKey: TAB_KEYS.PUBLISHED,
			tab: <>{t('loc:Publikované')}</>,
			tabPaneContent: null
		},
		{
			tabKey: TAB_KEYS.DELETED,
			tab: <>{t('loc:Vymazané')}</>,
			tabPaneContent: null
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent className={'box-tab'} activeKey={tabKey} onChange={onTabChange} tabsContent={tabContent} destroyInactiveTabPane />
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={isLoading}>
							<ReviewsFilter onSubmit={handleSubmit} />
							<CustomTable
								className='table-fixed table-no-hover-style'
								onChange={onChangeTable}
								columns={columns}
								dataSource={reviews?.data?.reviews}
								rowKey='id'
								scroll={{ x: 800 }}
								twoToneRows
								onRow={(record) => ({
									className: record.verificationStatus === REVIEW_VERIFICATION_STATUS.NOT_VERIFIED ? 'noti-table-row-warning' : undefined
								})}
								expandable={{
									expandedRowRender: (record) => (
										<p className={'mb-2 whitespace-pre-wrap'}>
											<i>{record.reviewMessage || '-'}</i>
										</p>
									),
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

export default compose(withPermissions(permissions))(ReviewsPage)
