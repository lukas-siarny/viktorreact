import React, { useEffect, useState } from 'react'
import { Button, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'

// types
import { Columns } from '../../../types/interfaces'

// components
import CustomTable from '../../../components/CustomTable'

// utils
import { patchReq } from '../../../utils/request'
import { ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'

// redux
import { RootState } from '../../../reducers'
import { getCurrentUser, getPendingInvites } from '../../../reducers/users/userActions'

const PendingInvites = () => {
	const pendingInvites = useSelector((state: RootState) => state.user.pendingInvites)
	const currentUser = useSelector((state: RootState) => state.user.authUser)

	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [submitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (currentUser.data?.id) {
			dispatch(getPendingInvites(currentUser.data?.id))
		}
	}, [dispatch, currentUser.data?.id])

	const acceptInvite = async (salonID: string) => {
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
			title: () => <h4>{t('loc:Boli ste pozvaný do salónu')}</h4>,
			dataIndex: 'salon',
			key: 'name',
			sorter: false,
			width: '100%',
			render: (value) => <span className='base-regular pl-4'>{value.name}</span>
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

	return !isEmpty(pendingInvites.data?.pendingEmployeeInvites) ? (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body mt-8'>
					<CustomTable
						columns={columns}
						dataSource={pendingInvites?.data?.pendingEmployeeInvites}
						loading={pendingInvites?.isLoading || currentUser?.isLoading || submitting}
						twoToneRows
						pagination={false}
						rowKey={(record) => record.salon?.id}
					/>
				</div>
			</Col>
		</Row>
	) : null
}

export default PendingInvites
