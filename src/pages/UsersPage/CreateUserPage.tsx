import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
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
import { FORM, LANGUAGE, PERMISSION, ENUMERATIONS_KEYS } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { getRoles } from '../../reducers/roles/rolesActions'
import { getPrefixCountryCode } from '../../utils/helper'
import { RootState } from '../../reducers'

const CreateUserPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const isFormPristine = useSelector(isPristine(FORM.ADMIN_CREATE_USER))
	const [submitting, setSubmitting] = useState<boolean>(false)

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam používateľov'),
				link: t('paths:users')
			},
			{
				name: t('loc:Nový používateľ')
			}
		]
	}

	const fetchData = async () => {
		const phonePrefixCountryCode = getPrefixCountryCode(
			map(phonePrefixes?.data, (item) => item.code),
			LANGUAGE.SK.toUpperCase()
		)
		dispatch(initialize(FORM.ADMIN_CREATE_USER, { phonePrefixCountryCode }))
		dispatch(getRoles())
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
			history.push(userID > 0 ? t('paths:users/{{userID}}', { userID }) : t('paths:users'))
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
				<CreateUserAccountForm onSubmit={createUser} />
				<div className={'content-footer'}>
					<Row justify='center'>
						<Button
							type={'primary'}
							block
							size={'middle'}
							className={'noti-btn m-regular mb-2 w-1/3'}
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
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_CREATE]))(CreateUserPage)
