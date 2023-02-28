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

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import SmsUnitPricesForm from './components/SmsUnitPricesForm'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS, ENUMERATIONS_KEYS, CREATE_BUTTON_ID } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { normalizeDirectionKeys, setOrder } from '../../utils/helper'

// reducers
import { getSmsUnitPrices, ISmsUnitPricesPayload } from '../../reducers/smsUnitPrices/smsUnitPricesActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, ISmsUnitPricesForm } from '../../types/interfaces'
import { RootState } from '../../reducers'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'
import useBackUrl from '../../hooks/useBackUrl'

type TableDataItem = NonNullable<ISmsUnitPricesPayload['data']>['unitPricesPerCounty'][0]

const SmsUnitPricesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)

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

	const countryName = countries.data?.find((contry) => contry.code.toLocaleLowerCase() === countryCode?.toLocaleLowerCase())?.name

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

	const changeFormVisibility = (show?: boolean, smsUnitPrice?: /* ISpecialistContact */ any) => {
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
			validFrom: formData.validFrom,
			countryCode: formData.countryCode
		}

		try {
			if (selectedSmsUnitPrice?.id) {
				await patchReq('/api/b2b/admin/enums/sms-unit-prices/{smsUnitPriceID}', { smsUnitPriceID: selectedSmsUnitPrice.id }, body)
			} else {
				await postReq('/api/b2b/admin/enums/sms-unit-prices/', null, body)
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
		if (!selectedSmsUnitPrice?.id) {
			return
		}
		try {
			await deleteReq('/api/b2b/admin/enums/sms-unit-prices/{smsUnitPriceID}', { smsUnitPriceID: selectedSmsUnitPrice.id })
			fetchData()
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const formClass = cx({
		'w-2/3 xl:w-1/2': visibleForm
	})

	const columns: ColumnProps<TableDataItem>[] = [
		{
			title: t('loc:Krajina'),
			dataIndex: 'country',
			key: 'country',
			ellipsis: true,
			render: (_value, record) => {
				const { country } = record
				const name = country.name || country.code
				return (
					<div className={'flex items-center gap-2'}>
						{country.flag && <img src={country.flag} alt={name} width={24} />}
						<span className={'truncate inline-block'}>{name}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Jednotková cena SMS'),
			dataIndex: 'amount',
			key: 'amount',
			ellipsis: true,
			render: (_value, record) => {
				const value = record.amount
				const { currencyCode } = record.country
				const currency = currencies.data?.find((item) => item.code === currencyCode)
				let result = `${value} ${currency?.symbol}`
				if (record.actualValid) {
					result = t('loc:{{ price }} (aktuálne platná)', { price: result })
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
			sortOrder: setOrder(query.order, 'validFrom'),
			render: (_value, record) => {
				const valueFrom = record.validFrom
				const valueTo = record.validTo
				let result = dayjs(valueFrom).format('D.M.YYYY')
				if (valueTo) {
					result = `${result} - ${dayjs(valueTo).format('D.M.YYYY')}`
				} else {
					result = t('loc:od {{ timeFrom }}', { timeFrom: result })
				}
				return result
			}
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={smsUnitPrices?.isLoading}>
							<div className={'pt-0 flex gap-4 justify-between items-center'}>
								<h3 className={'text-base whitespace-nowrap'}>{t('loc:Ceny SMS správ')}</h3>
								<Button
									onClick={() => {
										dispatch(initialize(FORM.SMS_UNIT_PRICES_FORM, { countryCode: countryCode?.toLocaleUpperCase() }))
										changeFormVisibility(true)
									}}
									type='primary'
									htmlType='button'
									className={'noti-btn'}
									icon={<PlusIcon />}
									id={`${CREATE_BUTTON_ID}-${FORM.SMS_UNIT_PRICES_FORM}`}
								>
									{STRINGS(t).addRecord(t('loc:cenu'))}
								</Button>
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
											countryCode={countryCode}
											smsUnitPriceID={selectedSmsUnitPrice?.id}
											disabledForm={selectedSmsUnitPrice?.disabled}
											closeForm={changeFormVisibility}
											onSubmit={handleSubmit}
											onDelete={handleDelete}
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

export default compose(withPermissions([PERMISSION.ENUM_EDIT]))(SmsUnitPricesPage)
