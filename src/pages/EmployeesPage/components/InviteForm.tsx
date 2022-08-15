import React, { FC, useEffect, useState } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form, Modal, Collapse, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// interfaces
import { IInviteEmployeeForm } from '../../../types/interfaces'

// utils
import { FORM, SALON_ROLES, SALON_ROLES_AUTHORIZATIONS, SALON_ROLES_KEYS, SALON_ROLES_TRANSLATIONS } from '../../../utils/enums'

// validate
import validateInviteFrom from './validateInviteFrom'

// reducers
import { RootState } from '../../../reducers'
import { getSalonRoles } from '../../../reducers/roles/rolesActions'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as CheckIcon } from '../../../assets/icons/check-icon-success-16.svg'
import { ReactComponent as CrossedIcon } from '../../../assets/icons/crossed-red-16.svg'
import { ReactComponent as InfoIcon24 } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as InfoIcon16 } from '../../../assets/icons/info-icon-16.svg'

type ComponentProps = {}

const { Panel } = Collapse

type Props = InjectedFormProps<IInviteEmployeeForm, ComponentProps> & ComponentProps

const InviteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props
	const dispatch = useDispatch()

	const [visibleRolesModal, setVisibleRolesModal] = useState(false)

	const roles = useSelector((state: RootState) => state.roles.salonRoles)

	useEffect(() => {
		dispatch(getSalonRoles())
	}, [dispatch])

	return (
		<>
			<Form layout='vertical' onSubmitCapture={handleSubmit}>
				<p className={'base-regular mb-7'}>{t('loc:Uveďte adresu, na ktorú odošleme link pre pozvanie zamestnanca do tímu.')}</p>
				<Field
					component={SelectField}
					options={roles?.data}
					label={
						<>
							{t('loc:Rola')} <InfoIcon16 style={{ marginBottom: 2 }} className={'ml-1 cursor-pointer'} onClick={() => setVisibleRolesModal(true)} />
						</>
					}
					placeholder={t('loc:Vyberte rolu')}
					name={'roleID'}
					size={'large'}
					loading={roles?.isLoading}
					required
				/>
				<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
			</Form>
			<Modal
				className={'noti-roles-tooltip-modal rounded-fields md:p-4'}
				title={
					<Row align={'middle'} className={'gap-1'}>
						<InfoIcon24 />
						{t('loc:Výber role')}
					</Row>
				}
				visible={visibleRolesModal}
				centered
				footer={null}
				onCancel={() => setVisibleRolesModal(false)}
				closeIcon={<CloseIcon />}
			>
				<>
					<p className={'text-notino-grayDark max-w-md'}>
						{t('loc: Spravovanie znamená tvorbu, upravovanie a mazanie vybraných údajov a informácii (Ak nie je v zátvorke definovnaé inak).')}
					</p>
					<Collapse className={'noti-collapse m-0'} bordered={false} defaultActiveKey={SALON_ROLES_KEYS} ghost expandIconPosition={'right'}>
						{SALON_ROLES_KEYS.map((salonRole) => {
							return (
								<Panel key={salonRole} header={<h4 className={'text-base my-2'}>{SALON_ROLES_TRANSLATIONS()[salonRole as SALON_ROLES]}</h4>}>
									<ul className={'list-none pl-0'}>
										{SALON_ROLES_AUTHORIZATIONS().map((authorization, index) => {
											const isAllowed = authorization.allowed.includes(salonRole as SALON_ROLES)
											const extra = (authorization.extra as any)[salonRole]
											const icon = isAllowed ? <CheckIcon /> : <CrossedIcon />
											return (
												<li key={index} className={'flex items-start gap-2'}>
													<span className={'pt-1'}>{icon}</span>
													<span>
														{authorization.name} {extra && <i>{`(${extra})`}</i>}
													</span>
												</li>
											)
										})}
									</ul>
								</Panel>
							)
						})}
					</Collapse>
				</>
			</Modal>
		</>
	)
}

const form = reduxForm<IInviteEmployeeForm, ComponentProps>({
	form: FORM.INVITE_EMPLOYEE,
	forceUnregisterOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validateInviteFrom
})(InviteForm)

export default form
