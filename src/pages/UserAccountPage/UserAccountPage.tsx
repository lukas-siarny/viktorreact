import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import { isEmpty } from 'lodash'
import { initialize, submit } from 'redux-form'
import cx from 'classnames'

// components
import UserAccountFrom from './components/UserAccountFrom'
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'

// enums
import { FORM, MSG_TYPE, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getUserAccountDetails } from '../../reducers/users/userActions'

// types
import { IBreadcrumbs, IComputedMatch } from '../../types/interfaces'

// utils
import { deleteReq, patchReq } from '../../utils/request'
import { getPath, history } from '../../utils/history'
import { checkPermissions } from '../../utils/Permissions'
import showNotifications from '../../utils/tsxHelpers'

type Props = {
	computedMatch: IComputedMatch<{ userID: number }>
}

const UserAccountPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { computedMatch } = props
	const { userID } = computedMatch.params
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const authUser = useSelector((state: RootState) => state.user.authUser)

	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const userAccountDetail = useSelector((state: RootState) => (userID ? state.user.user : state.user.authUser))

	const showDeleteBtn: boolean =
		authUser.data?.id !== userAccountDetail.data?.id && checkPermissions(authUserPermissions, [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_DELETE])

	useEffect(() => {
		if (userID) {
			dispatch(getUserAccountDetails(userID))
		}
	}, [dispatch, userID])

	// init forms
	useEffect(() => {
		dispatch(initialize(FORM.USER_ACCOUNT_FORM, { ...userAccountDetail.data, ...userAccountDetail.data?.company }))
	}, [userAccountDetail.data, dispatch])

	const handleUserAccountFormSubmit = async (data: any) => {
		try {
			setSubmitting(true)
			let userData: any = {
				firstName: data?.firstName,
				lastName: data?.lastName,
				phonePrefixCountryCode: data?.phonePrefixCountryCode,
				phone: data?.phone
			}

			// check one required field for company info
			if (data?.companyName) {
				userData = {
					...userData,
					company: {
						businessID: data?.businessID,
						vatID: data?.vatID,
						companyName: data?.companyName,
						zipCode: data?.zipCode,
						city: data?.city,
						street: data?.street,
						countryCode: data?.countryCode
					}
				}
			}
			await patchReq('/api/b2b/admin/users/{userID}', { userID: 1 }, userData)
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
				link: getPath(t('paths:users'))
			},
			{
				name: t('loc:Detail používateľa'),
				titleName:
					userAccountDetail.data?.firstName && userAccountDetail.data?.lastName
						? `${userAccountDetail.data?.firstName} ${userAccountDetail.data?.lastName}`
						: userAccountDetail.data?.email
			}
		]
	}

	const deleteUser = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq('/api/b2b/admin/users/{userID}', { userID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			history.push(getPath(t('paths:users')))
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

	const rowClass = cx({
		'justify-between': showDeleteBtn,
		'justify-center': !showDeleteBtn
	})

	return (
		<>
			<Row className={hideClass}>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={getPath(t('paths:users'))} />
			</Row>
			<div className='content-body small'>
				<UserAccountFrom onSubmit={handleUserAccountFormSubmit} isCompany={!isEmpty(userAccountDetail.data?.company)} />
				<Row className={rowClass}>
					{showDeleteBtn ? (
						<DeleteButton
							className={`mt-2 mb-2 w-1/3`}
							onConfirm={deleteUser}
							entityName={t('loc:používateľa')}
							type={'default'}
							getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
						/>
					) : undefined}
					<Button
						type={'primary'}
						block
						size={'middle'}
						className={`noti-btn m-regular mt-2 mb-2 w-1/3`}
						htmlType={'submit'}
						onClick={() => {
							if (checkPermissions(authUserPermissions, [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_EDIT])) {
								dispatch(submit(FORM.USER_ACCOUNT_FORM))
							} else {
								showNotifications([{ type: MSG_TYPE.ERROR, message: t('loc:Pre túto akciu nemáte dostatočné oprávnenia!') }], NOTIFICATION_TYPE.NOTIFICATION)
							}
						}}
						disabled={submitting}
						loading={submitting}
					>
						{t('loc:Uložiť')}
					</Button>
				</Row>
			</div>
		</>
	)
}

export default UserAccountPage
