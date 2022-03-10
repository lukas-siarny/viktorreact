import React, { FC } from 'react'
// import { Field, reduxForm, InjectedFormProps } from 'redux-form'
// import { Space, Row, Form, Button } from 'antd'
// import { Link } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'

// atoms
// import InputField from '../../../atoms/InputField'

// // interfaces
// import { ILoginForm } from '../../../types/interfaces'

// // utils
// import { FORM } from '../../../utils/enums'

// validate
// eslint-disable-next-line import/no-cycle
// import validateRegistrationForm from './validateRegistrationForm'
// import InputPasswordField from '../../../atoms/InputPasswordField'

// type ComponentProps = {}

// type Props = InjectedFormProps<ILoginForm, ComponentProps> & ComponentProps
type Props = {}

const RegistrationForm: FC<Props> = () => {
	// const [t] = useTranslation()
	// const { handleSubmit, submitting, form } = props

	return <h2>Preparing...</h2>

	// return (
	// 	<Form layout={'vertical'} className={'form h-full'} onSubmitCapture={handleSubmit}>
	// 		<Space className={'w-full'} direction={'vertical'} size={26}>
	// 			<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} />
	// 			<Field component={InputPasswordField} label={t('loc:Heslo')} placeholder={t('loc:Zadajte heslo')} type={'password'} size={'large'} name={'password'} />
	// 		</Space>
	// 		<Row justify={'end'} className=''>
	// 			<Link to='paths:zabudnute-heslo'>
	// 				<Button style={{ paddingRight: 0 }} block className={'noti-btn text-notino-black'} type={'link'} htmlType={'button'}>
	// 					{t('loc:Zabudnuté heslo')}
	// 				</Button>
	// 			</Link>
	// 		</Row>
	// 		<div className='absolute bottom-0 left-0 right-0'>
	// 			<Button type={'primary'} block size={'large'} className={`noti-btn m-regular mb-4`} htmlType={'submit'} disabled={submitting} loading={submitting}>
	// 				{t('loc:Prihlásiť sa')}
	// 			</Button>
	// 			<span className='table m-auto text-notino-black'>
	// 				{t('loc:Ešte nemáte účet?')}
	// 				<Link to='paths:zabudnute-heslo' className='inline-block'>
	// 					<Button style={{ paddingRight: 0 }} type={'link'} htmlType={'button'}>
	// 						{t('loc:Registrovať sa')}
	// 					</Button>
	// 				</Link>
	// 			</span>
	// 		</div>
	// 	</Form>
	// )
}

// const form = reduxForm<ILoginForm, ComponentProps>({
// 	form: FORM.LOGIN,
// 	forceUnregisterOnUnmount: true,
// 	touchOnChange: true,
// 	destroyOnUnmount: true,
// 	validate: validateRegistrationForm
// })(LoginForm)

// export default form
export default RegistrationForm
