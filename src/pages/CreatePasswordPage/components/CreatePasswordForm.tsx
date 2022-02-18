import React, { PureComponent } from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Form, Space } from 'antd'
import { withTranslation, WithTranslation } from 'react-i18next'
import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { get } from 'lodash'

// types
import Progress from 'antd/es/progress/progress'
import { ICreatePasswordForm } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

// atoms
import InputField from '../../../atoms/InputField'

// utils
import { FORM } from '../../../utils/enums'

// validate
// eslint-disable-next-line import/no-cycle
import validateCreatePasswordForm from './validateCreatePasswordForm'

const mapStateToProps = (state: RootState) => ({
	formValues: getFormValues(FORM.CREATE_PASSWORD)(state)
})

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

export type ComponentProps = WithTranslation & PropsFromRedux

type Props = InjectedFormProps<ICreatePasswordForm, ComponentProps> & ComponentProps

class CreatePasswordForm extends PureComponent<Props> {
	render() {
		const { t, handleSubmit, formValues, submitting } = this.props

		const renderPercent = () => {
			let percent = 0
			if (get(formValues, 'password')) {
				// 1 malé písmeno
				if (/(?=.*[a-z])/.test(get(formValues, 'password'))) {
					percent += 20
				}
				// 1 číslo
				if (/(?=.*\d)/.test(get(formValues, 'password'))) {
					percent += 20
				}
				// 1 veľké písmeno
				if (/(?=.*[A-Z])/.test(get(formValues, 'password'))) {
					percent += 20
				}
				// Aspon 8 znakov
				if (get(formValues, 'password.length') >= 8) {
					percent += 20
				}
				// 1 specialny znak
				if (/(?=.*?([^\w\s]|[_]))/.test(get(formValues, 'password'))) {
					percent += 20
				}
			}
			return percent
		}

		return (
			<Form layout='vertical' className={'create-password-form'} onSubmitCapture={handleSubmit}>
				<Space className={'w-full'} direction='vertical' size={20}>
					<h3>{t('loc:Obnova hesla')}</h3>
					<Field component={InputField} label={t('loc:Heslo')} placeholder={t('loc:Zadajte nové heslo')} name='password' type='password' required />
					<Progress
						percent={renderPercent()}
						strokeColor={{
							'0%': '#108ee9',
							'100%': '#87d068'
						}}
					/>
					<Field component={InputField} label={t('loc:Zopakujte heslo')} placeholder={t('loc:Zopakujte nové heslo')} type='password' name='confirmPassword' required />
					<Button block size='large' type='primary' className={'tp-btn square'} htmlType='submit' disabled={submitting} loading={submitting}>
						{t('loc:Vytvoriť heslo')}
					</Button>
				</Space>
			</Form>
		)
	}
}

const form = reduxForm<ICreatePasswordForm, ComponentProps>({
	form: FORM.CREATE_PASSWORD,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateCreatePasswordForm
})(CreatePasswordForm)

export default withTranslation()(compose(connector)(form))
