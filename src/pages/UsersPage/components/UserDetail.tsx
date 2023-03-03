import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Spin } from 'antd'
import { initialize, isPristine, isSubmitting, submit } from 'redux-form'

// components
import UserAccountForm from './UserAccountForm'
import DeleteButton from '../../../components/DeleteButton'

// reducers
import { RootState } from '../../../reducers'
import { getUser } from '../../../reducers/users/userActions'

// types
import { IUserAccountForm } from '../../../types/interfaces'

// utils
import { deleteReq, patchReq } from '../../../utils/request'
import Permissions from '../../../utils/Permissions'
import { formFieldID } from '../../../utils/helper'
import { DELETE_BUTTON_ID, FORM, NOTIFICATION_TYPE, PERMISSION, SUBMIT_BUTTON_ID } from '../../../utils/enums'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

type Props = {
	onDeleteSuccess: () => void
	deleteEntityName: string
	ignoreDeletePermissions?: boolean
	submitPermissions: PERMISSION[]
	userID: string
	deleteInProgress?: (progress: boolean) => void
	onPatchSuccess?: () => void
}

const UserDetail = (props: Props) => {
	const [t] = useTranslation()
	const { userID, onDeleteSuccess, deleteEntityName, ignoreDeletePermissions, submitPermissions, deleteInProgress, onPatchSuccess } = props
	const { user } = useSelector((state: RootState) => state.user)
	const userData = user.data?.user
	const dispatch = useDispatch()
	const submittingAccountForm = useSelector(isSubmitting(FORM.USER_ACCOUNT))
	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const isFormPristine = useSelector(isPristine(FORM.USER_ACCOUNT))

	const isLoading = user.isLoading || isRemoving

	useEffect(() => {
		dispatch(getUser(userID))
	}, [userID, dispatch])

	useEffect(() => {
		dispatch(
			initialize(FORM.USER_ACCOUNT, {
				...userData,
				avatar: userData?.image ? [{ url: userData?.image?.original, uid: userData?.image?.id }] : null
			})
		)
	}, [dispatch, userData])

	useEffect(() => {
		if (deleteInProgress) {
			deleteInProgress(isRemoving)
		}
	}, [isRemoving, deleteInProgress])

	const handleUserAccountFormSubmit = async (data: IUserAccountForm) => {
		try {
			const body: any = {
				firstName: data?.firstName,
				lastName: data?.lastName,
				phonePrefixCountryCode: data?.phonePrefixCountryCode,
				phone: data?.phone,
				imageID: data?.avatar?.[0]?.id || null,
				assignedCountryCode: data?.assignedCountryCode
			}

			await patchReq('/api/b2b/admin/users/{userID}', { userID }, body)
			if (onPatchSuccess) onPatchSuccess()
			dispatch(initialize(FORM.USER_ACCOUNT, data))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const deleteUser = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq('/api/b2b/admin/users/{userID}', { userID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			onDeleteSuccess()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	return (
		<>
			<div className='content-body small'>
				<Spin spinning={isLoading || submittingAccountForm}>
					<UserAccountForm onSubmit={handleUserAccountFormSubmit} />
					<div className={'content-footer'}>
						<div className={'flex flex-col gap-2 md:flex-row md:justify-between'}>
							<DeleteButton
								permissions={[PERMISSION.USER_DELETE]}
								className={'w-full md:w-auto md:min-w-50 xl:min-w-60'}
								id={formFieldID(FORM.USER_ACCOUNT, DELETE_BUTTON_ID)}
								onConfirm={deleteUser}
								entityName={deleteEntityName}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								ignorePermissions={ignoreDeletePermissions}
							/>
							<Permissions
								allowed={submitPermissions}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										id={formFieldID(FORM.USER_ACCOUNT, SUBMIT_BUTTON_ID)}
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

export default UserDetail
