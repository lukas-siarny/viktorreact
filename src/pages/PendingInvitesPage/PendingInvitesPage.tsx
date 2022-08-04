import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Button, Col, Row } from 'antd'
import { ColumnsType } from 'antd/lib/table'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { patchReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser, getPendingInvites } from '../../reducers/users/userActions'

// types
import { IBreadcrumbs } from '../../types/interfaces'

type Columns = ColumnsType<any>

const permissions: PERMISSION[] = [PERMISSION.PARTNER]

const PendingInvitesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [submitting, setIsSubmitting] = useState(false)

	const pendingInvites = useSelector((state: RootState) => state.user.pendingInvites)
	const currentUser = useSelector((state: RootState) => state.user.authUser)

	useEffect(() => {
		if (currentUser.data?.id) {
			dispatch(getPendingInvites(currentUser.data?.id))
		}
	}, [dispatch, currentUser.data?.id])

	const acceptInvite = async (salonID: number) => {
		if (!currentUser.data?.id) {
			return
		}

		setIsSubmitting(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/accept-employee-invite', { salonID }, { accept: true })
			dispatch(getPendingInvites(currentUser.data?.id))
			dispatch(getCurrentUser())
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		} finally {
			setIsSubmitting(false)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Názov salónu'),
			dataIndex: 'salon',
			key: 'name',
			sorter: false,
			width: '100%',
			render: (value) => value.name
		},
		{
			key: 'action',
			dataIndex: 'salon',
			sorter: false,
			render: (value) => {
				return (
					<Button
						type={'primary'}
						block
						size={'middle'}
						className={'noti-btn m-regular'}
						htmlType={'button'}
						onClick={() => acceptInvite(value.id)}
						disabled={pendingInvites?.isLoading || currentUser?.isLoading || submitting}
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
				name: t('loc:Zoznam čakajúcich pozvánok')
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
							loading={pendingInvites?.isLoading || currentUser?.isLoading || submitting}
							twoToneRows
							pagination={false}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(PendingInvitesPage)
