import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { initialize, isPristine, isSubmitting, submit } from 'redux-form'
import { get } from 'lodash'
import cx from 'classnames'

// components
import UserAccountForm from './components/UserAccountForm'
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'

// enums
import { DELETE_BUTTON_ID, FORM, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser, getUserAccountDetails, logOutUser } from '../../reducers/users/userActions'
import { getSystemRoles } from '../../reducers/roles/rolesActions'
import EditUserRoleForm from './components/EditUserRoleForm'

// types
import { IBreadcrumbs, IComputedMatch, IEditUserRoleForm, IUserAccountForm } from '../../types/interfaces'

// utils
import { deleteReq, patchReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions from '../../utils/Permissions'
import { formFieldID } from '../../utils/helper'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

// assets
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'

type Props = {
	computedMatch: IComputedMatch<{ userID: string }>
}

const UserPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const { computedMatch } = props
	const userID = computedMatch.params.userID || get(authUser, 'data.id')
	const dispatch = useDispatch()
	const submittingAccountForm = useSelector(isSubmitting(FORM.USER_ACCOUNT))
	const submittingEditRoleForm = useSelector(isSubmitting(FORM.EDIT_USER_ROLE))
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const userAccountDetail = useSelector((state: RootState) => (userID ? state.user.user : state.user.authUser)) as any
	const isMyAccountPath = computedMatch.path === t('paths:my-account')
	let submitPermissions = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_EDIT]

	const [backUrl] = useBackUrl(t('paths:users'))

	if (isMyAccountPath) {
		submitPermissions = [...submitPermissions, PERMISSION.PARTNER]
	}

	const isFormPristine = useSelector(isPristine(FORM.USER_ACCOUNT))

	const isMyAccountPage: boolean = authUser.data?.id === get(userAccountDetail, 'data.user.id')

	const isLoading = userAccountDetail.isLoading || isRemoving

	useEffect(() => {
		const fetchUserData = async () => {
			const { data } = await dispatch(getUserAccountDetails(userID))
			if (!data?.user?.id) {
				history.push('/404')
			}

			dispatch(
				initialize(FORM.USER_ACCOUNT, {
					...get(data, 'user'),
					avatar: data?.user?.image ? [{ url: data?.user?.image?.original, uid: data?.user?.image?.id }] : null
				})
			)

			if (!isMyAccountPath) {
				dispatch(getSystemRoles())
				dispatch(initialize(FORM.EDIT_USER_ROLE, { roleID: data?.user?.roles[0].id }))
			}
		}

		fetchUserData()
	}, [dispatch, isMyAccountPath, userID])

	const handleUserAccountFormSubmit = async (data: IUserAccountForm) => {
		try {
			const userData: any = {
				firstName: data?.firstName,
				lastName: data?.lastName,
				phonePrefixCountryCode: data?.phonePrefixCountryCode,
				phone: data?.phone,
				imageID: data?.avatar?.[0]?.id || null,
				assignedCountryCode: data?.assignedCountryCode
			}

			await patchReq('/api/b2b/admin/users/{userID}', { userID }, userData)
			if (!userID || authUser.data?.id === userID) dispatch(getCurrentUser())
			dispatch(initialize(FORM.USER_ACCOUNT, data))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	// View
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

	const deleteUser = async () => {
		if (isRemoving) {
			return
		}
		try {
			let id = userID
			if (isMyAccountPage && authUser.data) {
				id = authUser.data.id
			}
			setIsRemoving(true)
			await deleteReq('/api/b2b/admin/users/{userID}', { userID: id }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			if (isMyAccountPage) {
				dispatch(logOutUser())
				history.push(t('paths:login'))
			} else {
				history.push(t('paths:users'))
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	const editUserRole = async (data: IEditUserRoleForm) => {
		if (submittingEditRoleForm) {
			return
		}
		try {
			await patchReq(
				'/api/b2b/admin/users/{userID}/role',
				{ userID },
				{
					roleID: data?.roleID
				}
			)
			await dispatch(getUserAccountDetails(userID))
			dispatch(initialize(FORM.EDIT_USER_ROLE, data))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const hideClass = cx({
		hidden: !userID
	})

	return (
		<>
			{!isMyAccountPath && (
				<>
					<Row className={hideClass}>
						<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:users')} />
					</Row>
					<div className='content-body small mb-8'>
						<Spin spinning={isLoading || submittingEditRoleForm}>
							<EditUserRoleForm onSubmit={editUserRole} />
						</Spin>
					</div>
				</>
			)}
			<div className='content-body small'>
				<Spin spinning={isLoading || submittingAccountForm}>
					<UserAccountForm onSubmit={handleUserAccountFormSubmit} />
					<div className={'content-footer'}>
						<div className={'flex flex-col gap-2 md:flex-row md:justify-between'}>
							<DeleteButton
								permissions={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_DELETE]}
								className={'w-full md:w-auto md:min-w-50 xl:min-w-60'}
								id={formFieldID(FORM.USER_ACCOUNT, DELETE_BUTTON_ID)}
								onConfirm={deleteUser}
								entityName={isMyAccountPage ? t('loc:účet') : t('loc:používateľa')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								ignorePermissions={isMyAccountPage}
							/>
							<Permissions
								allowed={submitPermissions}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										type={'primary'}
										size={'middle'}
										className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
										htmlType={'submit'}
										icon={<EditIcon />}
										onClick={(e) => {
											if (hasPermission) {
												dispatch(submit(FORM.USER_ACCOUNT))
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={submittingAccountForm || isFormPristine}
										loading={submittingAccountForm}
									>
										{t('loc:Uložiť')}
									</Button>
								)}
							/>
						</div>
					</div>
				</Spin>
			</div>
		</>
	)
}

export default UserPage
