import React, { Component } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { compose } from 'redux'
import { get } from 'lodash'
import qs from 'qs'
import { RouteProps } from 'react-router-dom'

// components
import CreatePasswordForm from './components/CreatePasswordForm'
// inteerfaces
import { ICreatePasswordForm } from '../../types/interfaces'

// utils
import { history, getPath } from '../../utils/history'
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE } from '../../utils/enums'

type Props = WithTranslation & RouteProps

class CreatePasswordPage extends Component<Props> {
	handleSubmit = async (values: ICreatePasswordForm) => {
		console.log(' CreatePasswordPage.tsx ~ line 22 ~ handleSubmit= ~ values', values)
		// try {
		// 	const data = {
		// 		password: get(values, 'password')
		// 	}
		// 	const { t } = qs.parse(document.location.search, { ignoreQueryPrefix: true })

		// 	const headers = {
		// 		Authorization: `Bearer ${t}`
		// 	}

		// 	const res = await postReq('/api/v1/authorization/reset-password', undefined, data, { headers }, NOTIFICATION_TYPE.NOTIFICATION, true)

		// history.push(getPath(this.props.t('paths:login')))

		// 	return res
		// } catch (e) {
		// 	return e
		// }
	}

	render() {
		return <CreatePasswordForm onSubmit={this.handleSubmit} />
	}
}

export default compose(withTranslation())(CreatePasswordPage)
