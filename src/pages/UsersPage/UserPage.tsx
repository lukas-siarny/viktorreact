import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { initialize, isPristine, submit } from 'redux-form'
import { get } from 'lodash'
import cx from 'classnames'

// components
import UserAccountForm from './components/UserAccountForm'
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'

// enums
import { FORM, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser, getUserAccountDetails, logOutUser } from '../../reducers/users/userActions'

// types
import { IBreadcrumbs, IComputedMatch } from '../../types/interfaces'

// utils
import { deleteReq, patchReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions from '../../utils/Permissions'

type Props = {
	computedMatch: IComputedMatch<{ userID: number }>
}

const UserPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const { computedMatch } = props
	const userID = computedMatch.params.userID || get(authUser, 'data.id')
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const userAccountDetail = useSelector((state: RootState) => (userID ? state.user.user : state.user.authUser)) as any
	const isMyAccountPath = computedMatch.path === t('paths:my-account')
	let submitPermissions = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_EDIT]

	if (isMyAccountPath) {
		submitPermissions = [...submitPermissions, PERMISSION.PARTNER]
	}

	const isFormPristine = useSelector(isPristine(FORM.USER_ACCOUNT))

	const isMyAccountPage: boolean = authUser.data?.id === get(userAccountDetail, 'data.id')

	const isLoading = userAccountDetail.isLoading || isRemoving

	const fetchUserData = async () => {
		const { data } = await dispatch(getUserAccountDetails(userID))
		if (!data?.user?.id) {
			history.push('/404')
		}
	}

	useEffect(() => {
		fetchUserData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, userID])

	// init forms
	useEffect(() => {
		dispatch(
			initialize(FORM.USER_ACCOUNT, {
				...get(userAccountDetail, 'data.user'),
				avatar: userAccountDetail?.data?.user?.image ? [{ url: userAccountDetail?.data?.user?.image?.original, uid: userAccountDetail?.data?.user?.image?.id }] : null
			})
		)
	}, [userAccountDetail, dispatch])

	const handleUserAccountFormSubmit = async (data: any) => {
		try {
			setSubmitting(true)
			const userData: any = {
				firstName: data?.firstName,
				lastName: data?.lastName,
				phonePrefixCountryCode: data?.phonePrefixCountryCode,
				phone: data?.phone,
				imageID: data?.avatar?.[0]?.id || null
			}

			await patchReq('/api/b2b/admin/users/{userID}', { userID }, userData)
			if (!userID || Number(authUser.data?.id) === Number(userID)) dispatch(getCurrentUser())
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam používateľov'),
				link: t('paths:users')
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

	const hideClass = cx({
		hidden: !userID
	})

	return (
		<>
			{!isMyAccountPath && (
				<Row className={hideClass}>
					<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:users')} />
				</Row>
			)}
			<Spin spinning={isLoading}>
				<div className='content-body small mt-2'>
					<UserAccountForm onSubmit={handleUserAccountFormSubmit} />
					<div className={'content-footer'}>
						<Row className={'justify-between'}>
							<DeleteButton
								permissions={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_DELETE]}
								className={'w-1/3'}
								onConfirm={deleteUser}
								entityName={isMyAccountPage ? t('loc:účet') : t('loc:používateľa')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
							<Permissions
								allowed={submitPermissions}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'noti-btn m-regular w-1/3'}
										htmlType={'submit'}
										onClick={(e) => {
											if (hasPermission) {
												dispatch(submit(FORM.USER_ACCOUNT))
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={submitting || isFormPristine}
										loading={submitting}
									>
										{t('loc:Uložiť')}
									</Button>
								)}
							/>
						</Row>
					</div>
				</div>
			</Spin>
		</>
	)
}

export default UserPage
