import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, TablePaginationConfig, Result, Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import { map } from 'lodash'
import cx from 'classnames'
import { SorterResult } from 'antd/lib/table/interface'
import dayjs from 'dayjs'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import SmsUnitPricesForm from './components/SmsUnitPricesForm'
import SmsUnitPricesFilter from './components/SmsUnitPricesFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS, ENUMERATIONS_KEYS, LANGUAGE, CREATE_BUTTON_ID } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { getPrefixCountryCode, getCountryNameFromNameLocalizations, normalizeDirectionKeys, setOrder, sortData, transformToLowerCaseWithoutAccent } from '../../utils/helper'
import i18n from '../../utils/i18n'

// reducers
import { getSmsUnitPrices, getSmsUnitPricesActual } from '../../reducers/smsUnitPrices/smsUnitPricesActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, Columns, ISpecialistContact, ISpecialistContactFilter, ISmsUnitPricesForm } from '../../types/interfaces'
import { RootState } from '../../reducers'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'

const SmsUnitPricesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)

	const [query, setQuery] = useQueryParams({
		countryCode: StringParam(),
		search: StringParam(),
		limit: NumberParam(25),
		page: NumberParam(1)
	})

	// undefined - represents new record
	const [smsUnitPriceID, setsmsUnitPriceID] = useState<string | undefined>(undefined)
	const [visibleRestrictionModal, setVisibleRestrictionModal] = useState(false)

	const smsUnitPricesActual = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPricesActual)
	const smsUnitPrices = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPrices)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const currencies = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.CURRENCIES])

	const selectedCountryCode = countries?.data?.find((country) => country.code === query.countryCode)?.code

	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})
	const hasEveryCountrySmsUnitPrices = !countries?.data?.some((country) => !smsUnitPricesActual?.data?.find((item) => item.country.code === country.code))

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam SMS kreditov')
			}
		]
	}

	useEffect(() => {
		dispatch(getSmsUnitPricesActual())
		dispatch(getSmsUnitPrices({ countryCode: 'SK' }))
		if (selectedCountryCode) {
			dispatch(getSmsUnitPrices({ countryCode: 'SK' }))
		}
	}, [dispatch])

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}

		phonePrefixes?.enumerationsOptions?.forEach((option) => {
			prefixes[option.key] = option.label
		})

		setPrefixOptions(prefixes)
	}, [phonePrefixes, dispatch])

	const tableData = useMemo(() => {
		if (!smsUnitPricesActual || !smsUnitPricesActual.data) {
			return []
		}
		const source = query.search
			? smsUnitPricesActual.data.filter((specialist: any) => {
					const countryName = transformToLowerCaseWithoutAccent(
						getCountryNameFromNameLocalizations(specialist.country?.nameLocalizations, i18n.language as LANGUAGE) || specialist.country?.code
					)
					const searchedValue = transformToLowerCaseWithoutAccent(query.search || undefined)
					return countryName.includes(searchedValue)
			  })
			: smsUnitPricesActual.data

		// transform to table data
		return source?.map((item) => ({
			...item,
			key: item.actual.id
		}))
	}, [query.search, smsUnitPricesActual])

	const changeFormVisibility = (show?: boolean, smsUnitPrice?: /* ISpecialistContact */ any) => {
		if (!show) {
			setVisibleForm(false)
			dispatch(initialize(FORM.SMS_UNIT_PRICES_FORM, {}))
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

		setsmsUnitPriceID(smsUnitPrice ? smsUnitPrice.id : undefined)
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

	const handleSubmit = async (formData: ISmsUnitPricesForm) => {
		const body = {
			amount: formData.amount,
			validFrom: formData.validFrom,
			countryCode: formData.countryCode
		}

		try {
			if (smsUnitPriceID) {
				await patchReq('/api/b2b/admin/enums/sms-unit-prices/{smsUnitPriceID}', { smsUnitPriceID }, body)
			} else {
				await postReq('/api/b2b/admin/enums/sms-unit-prices/', null, body) // TODO: remove any
			}
			dispatch(getSmsUnitPricesActual())
			changeFormVisibility()
			// reset search in case of newly created entity
			if (!smsUnitPriceID && query.search) {
				setQuery({ ...query, search: '' })
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}
	const handleDelete = async () => {
		if (!smsUnitPriceID) {
			return
		}
		try {
			await deleteReq('/api/b2b/admin/enums/sms-unit-prices/{smsUnitPriceID}', { smsUnitPriceID })
			dispatch(getSmsUnitPricesActual())
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const formClass = cx({
		'w-2/3 xl:w-1/2': visibleForm
	})

	const getPageTable = () => {
		if (selectedCountryCode) {
			const onChangePagination = (page: number, limit: number) => {
				const newQuery = {
					...query,
					limit,
					page
				}
				setQuery(newQuery)
			}

			return (
				<CustomTable
					className='table-fixed'
					columns={[]}
					onChange={onChangeTable}
					dataSource={tableData}
					rowClassName={'clickable-row'}
					twoToneRows
					onRow={(record) => ({
						onClick: () => changeFormVisibility(true, record)
					})}
					loading={smsUnitPricesActual.isLoading}
					useCustomPagination
					pagination={{
						pageSize: smsUnitPrices.data?.pagination?.limit,
						total: smsUnitPrices?.data?.pagination?.totalCount,
						current: smsUnitPrices?.data?.pagination?.page,
						disabled: smsUnitPrices?.isLoading,
						onChange: onChangePagination
					}}
				/>
			)
		}

		return (
			<CustomTable
				className='table-fixed'
				columns={[
					{
						title: t('loc:Krajina'),
						dataIndex: 'country',
						key: 'country',
						sortOrder: setOrder(query.order, 'country'),
						sorter: {
							compare: (a, b) => {
								const aValue = a?.country?.name
								const bValue = b?.country?.name
								return sortData(aValue, bValue)
							}
						},
						render: (value) => {
							const name = value.name || value.code
							return (
								<div className={'flex items-center gap-2'}>
									{value.flag && <img src={value.flag} alt={name} width={24} />}
									<span className={'truncate inline-block'}>{name}</span>
								</div>
							)
						}
					},
					{
						title: t('loc:Aktuálna cena SMS'),
						dataIndex: 'actual',
						key: 'amount',
						ellipsis: true,
						render: (value, record) => {
							const { currencyCode } = record.country
							const currency = currencies.data?.find((item) => item.code === currencyCode)
							return `${value} ${currency?.symbol}`
						}
					},
					{
						title: t('loc:Platná od'),
						dataIndex: 'actual',
						key: 'validFrom',
						ellipsis: true,
						sorter: false,
						render: (value) => {
							return <>{dayjs(value.actual.validFrom).format('D.M.YYYY')}</>
						}
					}
				]}
				onChange={onChangeTable}
				dataSource={tableData}
				rowClassName={'clickable-row'}
				twoToneRows
				pagination={false}
				onRow={(record) => ({
					onClick: () => changeFormVisibility(true, record)
				})}
				loading={smsUnitPricesActual.isLoading}
			/>
		)
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={smsUnitPricesActual?.isLoading}>
							<SmsUnitPricesFilter
								total={smsUnitPricesActual?.data?.length}
								onSubmit={(values: ISpecialistContactFilter) => {
									setQuery({ ...query, search: values.search })
								}}
								smsUnitPriceID={smsUnitPriceID}
								addButton={
									<Button
										onClick={() => {
											if (hasEveryCountrySmsUnitPrices) {
												setVisibleRestrictionModal(true)
											} else {
												dispatch(initialize(FORM.SPECIALIST_CONTACT, { phonePrefixCountryCode }))
												changeFormVisibility(true)
											}
										}}
										type='primary'
										htmlType='button'
										className={'noti-btn'}
										icon={<PlusIcon />}
										id={`${CREATE_BUTTON_ID}-${FORM.SMS_UNIT_PRICES_FORM}`}
									>
										{STRINGS(t).addRecord(t('loc:cenu'))}
									</Button>
								}
							/>
							<div className={'w-full flex'}>
								<div className={formClass}>{getPageTable()}</div>
								{visibleForm ? (
									<div className={'w-6/12 flex justify-around items-start'}>
										<Divider className={'h-full mx-6 xl:mx-9'} type={'vertical'} />
										<SmsUnitPricesForm closeForm={changeFormVisibility} smsUnitPriceID={smsUnitPriceID} onSubmit={handleSubmit} onDelete={handleDelete} />
									</div>
								) : undefined}
							</div>
						</Spin>
					</div>
				</Col>
			</Row>
			<Modal title={t('loc:Upozornenie')} open={visibleRestrictionModal} getContainer={() => document.body} onCancel={() => setVisibleRestrictionModal(false)} footer={null}>
				<Result
					status='warning'
					title={t('loc:Ďalšieho špecialistu nie je možné vytvoriť. Pre každú krajinu môžete vytvoriť maximálne jedného.')}
					extra={
						<Button className={'noti-btn'} onClick={() => setVisibleRestrictionModal(false)} type='primary'>
							{t('loc:Zatvoriť')}
						</Button>
					}
				/>
			</Modal>
		</>
	)
}

export default compose(withPermissions([PERMISSION.ENUM_EDIT]))(SmsUnitPricesPage)
