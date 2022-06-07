import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION } from '../../utils/enums'

const CreateEmployeePage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	// eslint-disable-next-line react/react-in-jsx-scope
	return <></>
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.EMPLOYEE_BROWSING, PERMISSION.PARTNER]))(CreateEmployeePage)
