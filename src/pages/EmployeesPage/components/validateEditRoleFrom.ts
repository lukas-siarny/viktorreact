import { FormErrors } from 'redux-form'
import i18next from 'i18next'

// types
import { IEditUserRoleForm } from '../../../types/interfaces'

export default (values: IEditUserRoleForm) => {
	const errors: FormErrors<IEditUserRoleForm> = {}

	if (values?.roleID) {
		errors.roleID = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
