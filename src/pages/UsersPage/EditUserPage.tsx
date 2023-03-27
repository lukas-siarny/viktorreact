import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Row, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isSubmitting, initialize } from 'redux-form'
import { get } from 'lodash'

// utils
import { PERMISSION, FORM } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { patchReq } from '../../utils/request'

// types
import { IBreadcrumbs, IEditUserRoleForm } from '../../types/interfaces'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import EditUserRoleForm from './components/EditUserRoleForm'
import UserDetail from './components/UserDetail'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

// reducers
import { RootState } from '../../reducers'
import { getUser } from '../../reducers/users/userActions'
import { getSystemRoles } from '../../reducers/roles/rolesActions'

const EditUserPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { userID } = useParams<{ userID?: string }>() as any
	const userAccountDetail = useSelector((state: RootState) => state.user.user)
	const submittingEditEmployeeRoleForm = useSelector(isSubmitting(FORM.EDIT_USER_ROLE))
	const [backUrl] = useBackUrl(t('paths:users'))
	const [isDeleting, setIsDeleting] = useState<boolean>(false)

	useEffect(() => {
		dispatch(getSystemRoles())
		dispatch(initialize(FORM.EDIT_USER_ROLE, { roleID: userAccountDetail?.data?.user?.roles[0].id }))
	}, [dispatch, userAccountDetail?.data?.user])

	const editUserRole = async (data: IEditUserRoleForm) => {
		if (submittingEditEmployeeRoleForm) {
			return
		}
		try {
			await patchReq(
				'/api/b2b/admin/users/{userID}/role',
				{ userID },
				{
					roleID: data?.roleID
				},
				{
					skip404Handler: true
				}
			)
			await dispatch(getUser(userID))
			dispatch(initialize(FORM.EDIT_USER_ROLE, data))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam používateľov'),
				link: backUrl
			},
			{
				name: t('loc:Detail používateľa'),
				titleName:
					get(userAccountDetail, 'data.user.firstName') && get(userAccountDetail, 'data.user.lastName')
						? `${get(userAccountDetail, 'data.user.firstName')} ${get(userAccountDetail, 'data.user.lastName')}`
						: get(userAccountDetail, 'data.user.email')
			}
		]
	}

	return (
		<>
			<>
				<Row>
					<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:users')} />
				</Row>
				<div className='content-body small mb-8'>
					<Spin spinning={userAccountDetail.isLoading || submittingEditEmployeeRoleForm || isDeleting}>
						<EditUserRoleForm onSubmit={editUserRole} />
					</Spin>
				</div>
			</>
			<UserDetail
				userID={userID}
				deleteEntityName={t('loc:používateľa')}
				onDeleteSuccess={() => navigate(t('paths:users'))}
				submitPermissions={[PERMISSION.USER_EDIT]}
				deleteInProgress={setIsDeleting}
			/>
		</>
	)
}

export default withPermissions([PERMISSION.NOTINO])(EditUserPage)
