import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { StringParam, useQueryParams } from 'use-query-params'
import { Button, Col, Row } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { initialize } from 'redux-form'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, LANGUAGE, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { history } from '../../utils/history'
import i18n from '../../utils/i18n'
import { getSupportContactCountryName } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs } from '../../types/interfaces'

// assets
import { getSupportContacts } from '../../reducers/supportContacts/supportContactsActions'
import { getPendingInvites } from '../../reducers/users/userActions'

type Columns = ColumnsType<any>

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]

const InvitesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const pendingInvites = useSelector((state: RootState) => state.user.pendingInvites)
	const currentUser = useSelector((state: RootState) => state.user.authUser)

	useEffect(() => {
		if (currentUser.data?.id) {
			dispatch(getPendingInvites(currentUser.data?.id))
		}
	}, [dispatch, currentUser.data?.id])

	const columns: Columns = [
		{
			title: t('loc:Názov salónu'),
			dataIndex: 'country',
			key: 'country',
			sorter: false,
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
			key: 'action',
			sorter: false,
			render: (_value, record) => {
				return (
					<Button
						type={'primary'}
						block
						size={'middle'}
						className={'noti-btn m-regular mt-2-5 w-52 xl:w-60'}
						htmlType={'button'}
						onClick={() => console.log('accept invite')}
						disabled={false}
					>
						{t('loc:Prijať pozvánku')}
					</Button>
				)
			}
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
					<div className='content-body small'>
						<CustomTable
							className='table-fixed'
							columns={columns}
							dataSource={pendingInvites?.data?.pendingEmployeeInvites}
							rowClassName={'clickable-row'}
							loading={pendingInvites?.isLoading}
							twoToneRows
							scroll={{ x: 800 }}
							pagination={false}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(InvitesPage)
