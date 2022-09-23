import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { initialize, submit, isPristine } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { map } from 'lodash'

// components
import CreateUserAccountForm from './components/CreateUserAccountForm'
import Breadcrumbs from '../../components/Breadcrumbs'

// types
import { IBreadcrumbs } from '../../types/interfaces'

// utils
import { history } from '../../utils/history'
import { FORM, PERMISSION, ENUMERATIONS_KEYS } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'

// reducers
import { getSystemRoles } from '../../reducers/roles/rolesActions'
import { RootState } from '../../reducers'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

const permission: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_CREATE]

const CreateUserPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const isFormPristine = useSelector(isPristine(FORM.ADMIN_CREATE_USER))
	const [submitting, setSubmitting] = useState<boolean>(false)

	const { isLoading } = phonePrefixes

	const [backUrl] = useBackUrl(t('paths:users'))

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam používateľov'),
				link: backUrl
			},
			{
				name: t('loc:Nový používateľ')
			}
		]
	}

	const fetchData = async () => {
		const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))
		dispatch(initialize(FORM.ADMIN_CREATE_USER, { phonePrefixCountryCode }))
		dispatch(getSystemRoles(true))
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phonePrefixes])

	const createUser = async (formData: any) => {
		try {
			setSubmitting(true)

			const { data } = await postReq('/api/b2b/admin/users/', null, {
				email: formData?.email,
				phone: formData?.phone,
				phonePrefixCountryCode: formData?.phonePrefixCountryCode,
				roleID: formData?.roleID
			})

			const userID = data.user.id
			history.push(userID ? t('paths:users/{{userID}}', { userID }) : t('paths:users'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:users')} />
			</Row>
			<div className='content-body small mt-2'>
				<Spin spinning={isLoading}>
					<CreateUserAccountForm onSubmit={createUser} />
					<div className={'content-footer'}>
						<Row justify='center'>
							<Button
								type={'primary'}
								block
								size={'middle'}
								className={'noti-btn m-regular w-52 xl:w-60'}
								htmlType={'submit'}
								onClick={() => {
									dispatch(submit(FORM.ADMIN_CREATE_USER))
								}}
								disabled={submitting || isFormPristine}
								loading={submitting}
							>
								{t('loc:Uložiť')}
							</Button>
						</Row>
					</div>
				</Spin>
			</div>
		</>
	)
}

export default compose(withPermissions(permission))(CreateUserPage)
