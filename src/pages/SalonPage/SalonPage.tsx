import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import { initialize, submit } from 'redux-form'
import { get } from 'lodash'
import cx from 'classnames'

// components
import { compose } from 'redux'
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonForm from './components/SalonForm'

// enums
import { FORM, MSG_TYPE, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getSalon } from '../../reducers/salons/salonsActions'

// types
import { IBreadcrumbs, IComputedMatch } from '../../types/interfaces'

// utils
import { deleteReq, patchReq } from '../../utils/request'
import { history } from '../../utils/history'
import { checkPermissions, withPermissions } from '../../utils/Permissions'
import showNotifications from '../../utils/tsxHelpers'

type Props = {
	computedMatch: IComputedMatch<{ salonID: number }>
}

const editPermissions: PERMISSION[] = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.PARTNER, PERMISSION.SALON_EDIT]

const SalonPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { computedMatch } = props
	const { salonID } = computedMatch.params
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const authUserPermissions = authUser?.data?.uniqPermissions || []

	const showDeleteBtn: boolean = checkPermissions(authUserPermissions, editPermissions)

	const salon = useSelector((state: RootState) => state.salons.salon)

	useEffect(() => {
		if (salonID) {
			dispatch(getSalon(salonID))
		}
	}, [dispatch, salonID])

	// init forms
	useEffect(() => {
		dispatch(initialize(FORM.USER_ACCOUNT, { ...salon.data }))
	}, [salon, dispatch])

	const handleSubmit = async (data: any) => {
		try {
			setSubmitting(true)
			const userData: any = {
				firstName: data?.firstName,
				lastName: data?.lastName,
				phonePrefixCountryCode: data?.phonePrefixCountryCode,
				phone: data?.phone
			}
			await patchReq('/api/b2b/admin/salons/{salonID}', { salonID: data?.id }, userData)
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
				name: t('loc:Zoznam salónov'),
				link: t('paths:salons')
			},
			{
				name: t('loc:Detail salónu'),
				titleName: get(salon, 'data.salon.name')
			}
		]
	}

	const deleteSalon = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq('/api/b2b/admin/salons/{salonID}', { salonID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			history.push(t('paths:salons'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	const hideClass = cx({
		hidden: !salonID
	})

	const rowClass = cx({
		'justify-between': showDeleteBtn,
		'justify-center': !showDeleteBtn
	})

	return (
		<>
			<Row className={hideClass}>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:salons')} />
			</Row>
			<div className='content-body small'>
				<SalonForm onSubmit={handleSubmit} />
				<Row className={rowClass}>
					{showDeleteBtn ? (
						<DeleteButton
							className={`mt-2 mb-2 w-1/3`}
							onConfirm={deleteSalon}
							entityName={t('loc:salón')}
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
							if (checkPermissions(authUserPermissions, editPermissions)) {
								dispatch(submit(FORM.SALON))
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

export default compose(withPermissions([...editPermissions, PERMISSION.SALON_BROWSING]))(SalonPage)
