import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Space, Row, Form, Button } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// atoms
import InputField from '../../../atoms/InputField'

// interfaces
import { ILoginForm } from '../../../types/interfaces'

// utils
import { FORM } from '../../../utils/enums'

// validate
// eslint-disable-next-line import/no-cycle
import validateLoginForm from './validateLoginForm'
import InputPasswordField from '../../../atoms/InputPasswordField'

type ComponentProps = {}

type Props = InjectedFormProps<ILoginForm, ComponentProps> & ComponentProps

const LoginForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, form } = props

	return (
		<Form layout={'vertical'} className={'login-form'} onSubmitCapture={handleSubmit}>
			<h3>{t('loc:Prihláste sa do TIP travel')}</h3>
			<Space className={'w-full'} direction={'vertical'} size={20}>
				<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
				<Field component={InputPasswordField} label={t('loc:Heslo')} placeholder={t('loc:Zadajte heslo')} type={'password'} size={'large'} name={'password'} required />
				<Button type={'primary'} block size={'large'} className={`tp-btn square ${form}`} htmlType={'submit'} disabled={submitting} loading={submitting}>
					{t('loc:Prihlásiť sa')}
				</Button>
				<Row justify={'end'}>
					<Link to={t('paths:zabudnute-heslo') as string}>
						<Button style={{ paddingRight: 0 }} block className={'tp-btn'} type={'link'} htmlType={'button'}>
							{t('loc:Zabudli ste heslo?')}
						</Button>
					</Link>
				</Row>
			</Space>
		</Form>
	)
}

const form = reduxForm<ILoginForm, ComponentProps>({
	form: FORM.LOGIN,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateLoginForm
})(LoginForm)

export default form
