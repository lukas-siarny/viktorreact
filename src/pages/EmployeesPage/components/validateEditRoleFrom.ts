import { get } from 'lodash'
import { FormErrors } from 'redux-form'
import i18next from 'i18next'

// types
import { IEditEmployeeRoleForm } from '../../../types/interfaces'

export default (values: IEditEmployeeRoleForm) => {
	const errors: FormErrors<IEditEmployeeRoleForm> = {}

	if (!get(values, 'roleID')) {
		errors.roleID = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
