import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, TablePaginationConfig } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import cx from 'classnames'
import { SorterResult } from 'antd/lib/table/interface'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import SmsUnitPricesForm from './components/SmsUnitPricesForm'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS, ENUMERATIONS_KEYS, CREATE_BUTTON_ID, D_M_YEAR_FORMAT, DEFAULT_DATE_INIT_FORMAT } from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { formFieldID, normalizeDirectionKeys, setOrder } from '../../utils/helper'

// reducers
import { getSmsUnitPrices, ISmsUnitPricesPayload } from '../../reducers/smsUnitPrices/smsUnitPricesActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import { RootState } from '../../reducers'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'
import useBackUrl from '../../hooks/useBackUrl'

// schema
import { ISmsUnitPricesForm } from '../../schemas/smsUnitPrices'

type TableDataItem = NonNullable<ISmsUnitPricesPayload['data']>['unitPricesPerCounty'][0]

const SmsUnitPricesDetailPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const { countryCode: countryCodeUrlParam } = useParams<{ countryCode: string }>()
	const countryCode = (countryCodeUrlParam as string).toUpperCase()

	const [query, setQuery] = useQueryParams({
		order: StringParam('validFrom:desc'),
		limit: NumberParam(25),
		page: NumberParam(1)
	})

	// undefined - represents new record
	const [selectedSmsUnitPrice, setSelectedSmsUnitPrice] = useState<{ id: string; disabled?: boolean } | undefined>(undefined)

	const smsUnitPrices = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPrices)
	const currencies = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.CURRENCIES])
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const country = countries?.data?.find((item) => item.code === countryCode)
	const countryName = country?.name
	const currencySymbol = currencies.data?.find((currency) => currency.code === country?.currencyCode)?.symbol

	const [backUrl] = useBackUrl(t('paths:sms-credits'))

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam SMS kreditov'),
				link: backUrl
			},
			{
				name: t('loc:Detail krajiny'),
				titleName: countryName || ''
			}
		]
	}

	const fetchData = useCallback(
		() => dispatch(getSmsUnitPrices({ countryCode, limit: query.limit, page: query.page, order: query.order })),
		[dispatch, countryCode, query.limit, query.page, query.order]
	)

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const changeFormVisibility = (show?: boolean, smsUnitPrice?: TableDataItem) => {
		if (!show) {
			setVisibleForm(false)
			dispatch(initialize(FORM.SMS_UNIT_PRICES_FORM, { countryCode }))
			return
		}

		if (smsUnitPrice) {
			dispatch(
				initialize(FORM.SMS_UNIT_PRICES_FORM, {
					amount: smsUnitPrice.amount,
					validFrom: smsUnitPrice.validFrom,
					countryCode: smsUnitPrice.country.code
				})
			)
		}

		setSelectedSmsUnitPrice(smsUnitPrice ? { id: smsUnitPrice.id, disabled: dayjs(smsUnitPrice.validFrom).isSameOrBefore(dayjs()) } : undefined)
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

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page
		}
		setQuery(newQuery)
	}

	const handleSubmit = async (formData: ISmsUnitPricesForm) => {
		const body = {
			amount: formData.amount,
			validFrom: formData.validFrom
		}

		try {
			if (selectedSmsUnitPrice?.id) {
				await patchReq('/api/b2b/admin/enums/sms-unit-prices/{smsUnitPriceID}', { smsUnitPriceID: selectedSmsUnitPrice.id }, body)
			} else {
				await postReq('/api/b2b/admin/enums/sms-unit-prices/', null, { ...body, countryCode: formData.countryCode })
			}
			fetchData()
			changeFormVisibility()
			// reset search in case of newly created entity
			if (!selectedSmsUnitPrice?.id && query.search) {
				setQuery({ ...query, search: '' })
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleDelete = async () => {
		if (!selectedSmsUnitPrice?.id || isRemoving) {
			return
		}
		setIsRemoving(true)
		try {
			await deleteReq('/api/b2b/admin/enums/sms-unit-prices/{smsUnitPriceID}', { smsUnitPriceID: selectedSmsUnitPrice.id })
			fetchData()
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
		setIsRemoving(false)
	}

	const formClass = cx({
		'w-2/3 xl:w-1/2': visibleForm
	})

	const columns: ColumnProps<TableDataItem>[] = [
		{
			title: t('loc:Krajina'),
			dataIndex: 'country',
			key: 'country',
			width: '20%',
			ellipsis: true,
			render: () => {
				const name = country?.name || country?.code
				return (
					<div className={'flex items-center gap-2'}>
						{country?.flag && <img src={country?.flag} alt={name} width={24} />}
						<span className={'truncate inline-block'}>{name}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Jednotková cena SMS'),
			dataIndex: 'amount',
			key: 'amount',
			align: 'right',
			width: '40%',
			ellipsis: true,
			render: (_value, record) => {
				const value = record.amount
				const { currencyCode } = record.country
				const currency = currencies.data?.find((item) => item.code === currencyCode)
				let result = `${value} ${currency?.symbol}`
				if (record.actualValid) {
					result = t('loc:aktuálne platná {{ price }}', { price: result })
				}
				return result
			}
		},
		{
			title: t('loc:Platnosť'),
			dataIndex: 'validFrom',
			key: 'validFrom',
			ellipsis: true,
			sorter: true,
			width: '40%',
			className: 'table-col-with-sorter-right',
			sortOrder: setOrder(query.order, 'validFrom'),
			align: 'right',
			render: (_value, record) => {
				const valueFrom = record.validFrom
				const valueTo = record.validTo
				let result = dayjs(valueFrom).format(D_M_YEAR_FORMAT)
				if (valueTo) {
					result = `${result} - ${dayjs(valueTo).format(D_M_YEAR_FORMAT)}`
				} else {
					result = t('loc:od {{ timeFrom }}', { timeFrom: result })
				}
				return result
			}
		}
	]

	const isEmptyCountry = isEmpty(smsUnitPrices.data?.unitPricesPerCounty)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className={cx('content-body', { 'pb-0': !visibleForm })}>
						<Spin spinning={smsUnitPrices?.isLoading || isRemoving}>
							<div className={'pt-0 flex gap-4 justify-between items-center'}>
								<h3 className={'text-base whitespace-nowrap'}>{t('loc:Ceny SMS správ')}</h3>
								<Permissions
									allowed={[PERMISSION.SMS_UNIT_PRICE_EDIT]}
									render={(hasPermission, { openForbiddenModal }) => (
										<Button
											onClick={() => {
												if (hasPermission) {
													dispatch(
														initialize(FORM.SMS_UNIT_PRICES_FORM, {
															countryCode: countryCode?.toLocaleUpperCase(),
															validFrom: isEmptyCountry ? dayjs().startOf('month').format(DEFAULT_DATE_INIT_FORMAT) : undefined
														})
													)
													changeFormVisibility(true)
												} else {
													openForbiddenModal()
												}
											}}
											type='primary'
											htmlType='button'
											className={'noti-btn'}
											icon={<PlusIcon />}
											id={formFieldID(FORM.SMS_UNIT_PRICES_FORM, CREATE_BUTTON_ID)}
										>
											{STRINGS(t).addRecord(t('loc:cenu'))}
										</Button>
									)}
								/>
							</div>
							<div className={'w-full flex'}>
								<div className={cx(formClass, { 'mb-4': visibleForm })}>
									<CustomTable<TableDataItem>
										className={'table-fixed'}
										wrapperClassName={'table-with-pagination-at-the-bottom'}
										columns={columns}
										onChange={onChangeTable}
										dataSource={smsUnitPrices.data?.unitPricesPerCounty}
										rowClassName={'clickable-row'}
										twoToneRows
										rowKey={'id'}
										onRow={(record) => ({
											onClick: () => changeFormVisibility(true, record)
										})}
										useCustomPagination
										pagination={{
											pageSize: smsUnitPrices.data?.pagination?.limit,
											total: smsUnitPrices?.data?.pagination?.totalCount,
											current: smsUnitPrices?.data?.pagination?.page,
											disabled: smsUnitPrices?.isLoading,
											onChange: onChangePagination
										}}
									/>
								</div>
								{visibleForm ? (
									<div className={'w-6/12 flex justify-around items-start'}>
										<Divider className={'h-full mx-6 xl:mx-9'} type={'vertical'} />
										<SmsUnitPricesForm
											currencySymbol={currencySymbol}
											smsUnitPriceID={selectedSmsUnitPrice?.id}
											disabledForm={selectedSmsUnitPrice?.disabled}
											countries={countries}
											changeFormVisibility={changeFormVisibility}
											onSubmit={handleSubmit}
											onDelete={handleDelete}
											isEmptyCountry={isEmptyCountry}
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

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.SMS_UNIT_PRICE_EDIT]))(SmsUnitPricesDetailPage)
