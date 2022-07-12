import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { StringParam, useQueryParams } from 'use-query-params'
import { Col, Row } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { initialize } from 'redux-form'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import SupportContactsFilter, { ISupportContactsFilter } from './components/SupportContactsFilter'

// utils
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, LANGUAGE, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { history } from '../../utils/history'

// reducers
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs } from '../../types/interfaces'

// assets
import { getSupportContacts } from '../../reducers/supportContacts/supportContactsActions'
import { getSupportContactCountryName } from '../../utils/helper'
import i18n from '../../utils/i18n'

type Columns = ColumnsType<any>

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]

const SupportContactsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)

	const [query, setQuery] = useQueryParams({
		countryCode: StringParam
	})

	useEffect(() => {
		dispatch(initialize(FORM.SALONS_FILTER, { countryCode: query.countryCode }))
		dispatch(getSupportContacts({ countryCode: query.countryCode }))
	}, [dispatch, query.countryCode])

	const handleSubmit = (values: ISupportContactsFilter) => {
		const newQuery = {
			...query,
			...values
		}
		setQuery(newQuery)
	}

	const columns: Columns = [
		{
			title: t('loc:Krajina'),
			dataIndex: 'country',
			key: 'country',
			sorter: false,
			width: '30%',
			render: (value) => {
				const name = getSupportContactCountryName(value.nameLocalizations, i18n.language as LANGUAGE) || value.code
				return (
					<div className={'flex items-center gap-2'}>
						{value.flag && <img src={value.flag} alt={name} width={24} />}
						<span className={'truncate inline-block'}>{name}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Mesto'),
			dataIndex: 'city',
			key: 'city',
			ellipsis: true,
			sorter: false,
			width: '30%'
		},
		{
			title: t('loc:Ulica'),
			dataIndex: 'street',
			key: 'street',
			ellipsis: true,
			sorter: false,
			width: '20%'
		},
		{
			title: t('loc:Číslo ulice'),
			dataIndex: 'streetNumber',
			key: 'streetNumber',
			ellipsis: true,
			sorter: false,
			width: '10%'
		},
		{
			title: t('loc:PSČ'),
			dataIndex: 'zipCode',
			key: 'zipCode',
			ellipsis: true,
			sorter: false,
			width: '10%'
		}
	]

	const breadcrumbs: IBreadcrumbs | undefined = {
		items: [
			{
				name: t('loc:Zoznam podporných centier')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Permissions
							allowed={permissions}
							render={(hasPermission, { openForbiddenModal }) => (
								<SupportContactsFilter
									createSupportContact={() => {
										if (hasPermission) {
											history.push(t('paths:support-contacts/create'))
										} else {
											openForbiddenModal()
										}
									}}
									onSubmit={handleSubmit}
								/>
							)}
						/>
						<CustomTable
							className='table-fixed'
							columns={columns}
							dataSource={supportContacts?.tableData}
							rowClassName={'clickable-row'}
							loading={supportContacts?.isLoading}
							twoToneRows
							onRow={(record) => {
								return {
									onClick: () => {
										history.push(t('paths:support-contacts/{{supportContactID}}', { supportContactID: record.supportContactID }))
									}
								}
							}}
							pagination={false}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(SupportContactsPage)
