import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

// utils
import { ROW_GUTTER_X_DEFAULT, PERMISSION, FORM } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

type Props = {}

const EditUserPage = (props: Props) => {
	const [t] = useTranslation()
	const { userID } = useParams<{ userID?: string }>()

	return <div>EditUserPage</div>
}

export default withPermissions([PERMISSION.NOTINO])(EditUserPage)
