import React, { FC, useEffect, useState } from 'react'
import { Button, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'

// components
import SalonDashboard from './SalonDashboard'
import CustomTable from '../../../components/CustomTable'

// utils
import { history } from '../../../utils/history'
import { patchReq } from '../../../utils/request'
import { ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'

// redux
import { RootState } from '../../../reducers'
import { getCurrentUser, getPendingInvites } from '../../../reducers/users/userActions'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// types
import { Columns } from '../../../types/interfaces'

type Props = {}

const PartnerDashboard: FC<Props> = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [submitting, setIsSubmitting] = useState(false)

	const salonOptions = useSelector((state: RootState) => state.selectedSalon.selectionOptions.data)
	const pendingInvites = useSelector((state: RootState) => state.user.pendingInvites)
	const currentUser = useSelector((state: RootState) => state.user.authUser)

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
			title: t('loc:Boli ste pozvaný do salónu'),
			dataIndex: 'salon',
			key: 'name',
			sorter: false,
			width: '100%',
			render: (value) => <h3>{value.name}</h3>
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

	return (
		<div className='partner-dashboard h-full'>
			{!isEmpty(pendingInvites.data?.pendingEmployeeInvites) && (
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={24}>
						<div className='content-body small'>
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
			)}
			{/* if salon is not selected and salon options are empty, display Create salon button */}
			<SalonDashboard>
				{isEmpty(salonOptions) && (
					<div className='flex add-button justify-center items-center'>
						<div className='m-auto text-center'>
							<h1 className='text-5xl font-bold'>{t('loc:Začnite vytvorením salónu')}</h1>
							<Button onClick={() => history.push(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
								{t('loc:Pridať salón')}
							</Button>
						</div>
					</div>
				)}
			</SalonDashboard>
		</div>
	)
}

export default PartnerDashboard
