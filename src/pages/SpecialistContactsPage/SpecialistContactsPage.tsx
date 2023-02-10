import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, TablePaginationConfig, Result, Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import { map } from 'lodash'
import cx from 'classnames'
import { StringParam, useQueryParams, withDefault } from 'use-query-params'
import { SorterResult } from 'antd/lib/table/interface'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import SpecialistContactForm from './components/SpecialistContactsForm'
import SpecialistContactFilter from './components/SpecialistContactsFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS, ENUMERATIONS_KEYS, LANGUAGE } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { getPrefixCountryCode, getCountryNameFromNameLocalizations, normalizeDirectionKeys, setOrder, sortData, transformToLowerCaseWithoutAccent } from '../../utils/helper'
import i18n from '../../utils/i18n'

// reducers
import { getSpecialistContacts } from '../../reducers/specialistContacts/specialistContactsActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, Columns, ISpecialistContact, ISpecialistContactForm, ISpecialistContactFilter } from '../../types/interfaces'
import { RootState } from '../../reducers'

const SpecialistContactsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		order: withDefault(StringParam, 'country:ASC')
	})

	// undefined - represents new record
	const [specialistContactID, setSpecialistContactID] = useState<string | undefined>(undefined)
	const [visibleRestrictionModal, setVisibleRestrictionModal] = useState(false)

	const specialistContacts = useSelector((state: RootState) => state.specialistContacts.specialistContacts)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})
	const hasEveryCountrySpecialistContact = !countries?.data?.some((country) => !specialistContacts?.data?.find((contact) => contact.country.code === country.code))

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam špecialistov')
			}
		]
	}

	useEffect(() => {
		dispatch(getSpecialistContacts())
	}, [dispatch])

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}

		phonePrefixes?.enumerationsOptions?.forEach((option) => {
			prefixes[option.key] = option.label
		})

		setPrefixOptions(prefixes)
	}, [phonePrefixes, dispatch])

	const tableData = useMemo(() => {
		if (!specialistContacts || !specialistContacts.data) {
			return []
		}
		const source = query.search
			? specialistContacts.data.filter((specialist) => {
					const countryName = transformToLowerCaseWithoutAccent(
						getCountryNameFromNameLocalizations(specialist.country?.nameLocalizations, i18n.language as LANGUAGE) || specialist.country?.code
					)
					const searchedValue = transformToLowerCaseWithoutAccent(query.search || undefined)
					return countryName.includes(searchedValue)
			  })
			: specialistContacts.data

		// transform to table data
		return source?.map((specialist) => ({
			...specialist,
			key: specialist.id
		}))
	}, [query.search, specialistContacts])

	const changeFormVisibility = (show?: boolean, specialist?: ISpecialistContact) => {
		if (!show) {
			setVisibleForm(false)
			dispatch(initialize(FORM.SPECIALIST_CONTACT, { phonePrefixCountryCode }))
			return
		}

		if (specialist) {
			dispatch(
				initialize(FORM.SPECIALIST_CONTACT, {
					email: specialist.email,
					phone: specialist.phone,
					phonePrefixCountryCode: specialist.phonePrefixCountryCode,
					countryCode: specialist.country.code
				})
			)
		}

		setSpecialistContactID(specialist ? specialist.id : undefined)
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

	const handleSubmit = async (formData: ISpecialistContactForm) => {
		const body = {
			email: formData.email,
			phone: formData.phone,
			phonePrefixCountryCode: formData.phonePrefixCountryCode,
			countryCode: formData.countryCode
		}

		try {
			if (specialistContactID) {
				await patchReq('/api/b2b/admin/enums/contacts/{contactID}', { contactID: specialistContactID }, body)
			} else {
				await postReq('/api/b2b/admin/enums/contacts/', null, body)
			}
			dispatch(getSpecialistContacts())
			changeFormVisibility()
			// reset search in case of newly created entity
			if (!specialistContactID && query.search) {
				setQuery({ ...query, search: null })
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}
	const handleDelete = async () => {
		if (!specialistContactID) {
			return
		}
		try {
			await deleteReq('/api/b2b/admin/enums/contacts/{contactID}', { contactID: specialistContactID })
			dispatch(getSpecialistContacts())
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Krajina'),
			dataIndex: 'country',
			key: 'country',
			sortOrder: setOrder(query.order, 'country'),
			sorter: {
				compare: (a, b) => {
					const aValue = getCountryNameFromNameLocalizations(a?.country?.nameLocalizations, i18n.language as LANGUAGE) || a?.country?.code
					const bValue = getCountryNameFromNameLocalizations(b?.country?.nameLocalizations, i18n.language as LANGUAGE) || b?.country?.code
					return sortData(aValue, bValue)
				}
			},
			render: (value) => {
				const name = getCountryNameFromNameLocalizations(value.nameLocalizations, i18n.language as LANGUAGE) || value.code
				return (
					<div className={'flex items-center gap-2'}>
						{value.flag && <img src={value.flag} alt={name} width={24} />}
						<span className={'truncate inline-block'}>{name}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Telefón'),
			dataIndex: 'phone',
			key: 'phone',
			ellipsis: true,
			sorter: false,
			render: (value, record) => {
				const source = value ? record : record.user

				return <>{source?.phone && prefixOptions[source?.phonePrefixCountryCode] ? `${prefixOptions[source?.phonePrefixCountryCode]} ${source.phone}` : '-'}</>
			}
		},
		{
			title: t('loc:Email'),
			dataIndex: 'email',
			key: 'email',
			ellipsis: true,
			render: (value) => value || '-'
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
						<Spin spinning={specialistContacts?.isLoading}>
							<SpecialistContactFilter
								total={specialistContacts?.data?.length}
								onSubmit={(values: ISpecialistContactFilter) => setQuery({ ...query, search: values.search })}
								specialistContactID={specialistContactID}
								addButton={
									<Button
										onClick={() => {
											if (hasEveryCountrySpecialistContact) {
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
									>
										{STRINGS(t).addRecord(t('loc:špecialistu'))}
									</Button>
								}
							/>
							<div className={'w-full flex'}>
								<div className={formClass}>
									<CustomTable
										className='table-fixed'
										columns={columns}
										onChange={onChangeTable}
										dataSource={tableData}
										rowClassName={'clickable-row'}
										twoToneRows
										pagination={false}
										onRow={(record) => ({
											onClick: () => changeFormVisibility(true, record)
										})}
										loading={specialistContacts.isLoading}
									/>
								</div>
								{visibleForm ? (
									<div className={'w-6/12 flex justify-around items-start'}>
										<Divider className={'h-full mx-6 xl:mx-9'} type={'vertical'} />
										<SpecialistContactForm
											closeForm={changeFormVisibility}
											specialistContactID={specialistContactID}
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
			<Modal
				title={t('loc:Upozornenie')}
				visible={visibleRestrictionModal}
				getContainer={() => document.body}
				onCancel={() => setVisibleRestrictionModal(false)}
				footer={null}
			>
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

export default compose(withPermissions([PERMISSION.ENUM_EDIT]))(SpecialistContactsPage)
