import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION } from '../../utils/enums'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_CREATE]

const CreateEmployeePage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	// eslint-disable-next-line react/react-in-jsx-scope
	return <></>
}

export default compose(withPermissions(permissions))(CreateEmployeePage)
