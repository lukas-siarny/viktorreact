import React, { FC, useState } from 'react'
import { Modal, Collapse, Row, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { Field } from 'redux-form'

// types
import { IRoleDescription, ISelectOptionItem } from '../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon.svg'
import { ReactComponent as InfoIcon24 } from '../assets/icons/info-icon.svg'
import { ReactComponent as InfoIcon16 } from '../assets/icons/info-icon-16.svg'

// atoms
import SelectField from './SelectField'
import SalonRolePermissions from './SalonRolePermissions'

const { Panel } = Collapse

type Props = {
	name: string
	loading?: boolean
	disabled?: boolean
	options: ISelectOptionItem[]
	className?: string
	required?: boolean
	size?: string
	rolesDescriptions: IRoleDescription[]
	tooltip?: string | null
}

const SalonRolesField: FC<Props> = (props) => {
	const { name, loading, options, disabled, className, required, size = 'large', rolesDescriptions, tooltip } = props
	const [t] = useTranslation()
	const [visible, setVisible] = useState(false)
	const defaultActiveKeys = rolesDescriptions.reduce((keys, role) => (role.permissions?.length ? [...keys, role.key] : keys), [] as string[])

	return (
		<>
			<Field
				component={SelectField}
				options={options}
				label={
					<>
						{t('loc:Rola')}{' '}
						<InfoIcon16
							className={'ml-1 cursor-pointer'}
							onClick={() => {
								setVisible(true)
							}}
						/>
					</>
				}
				placeholder={t('loc:Vyberte rolu')}
				name={name}
				size={size}
				loading={loading}
				disabled={disabled}
				className={className}
				required={required}
				tooltipSelect={tooltip}
			/>
			<Modal
				className={'noti-roles-tooltip-modal rounded-fields md:p-4'}
				title={
					<Row align={'middle'} className={'gap-1'}>
						<InfoIcon24 />
						{t('loc:Výber role')}
					</Row>
				}
				visible={visible}
				centered
				footer={null}
				onCancel={() => setVisible(false)}
				closeIcon={<CloseIcon />}
			>
				<Spin spinning={loading}>
					<p className={'text-notino-grayDark max-w-md'}>
						{t('loc:Spravovanie znamená tvorbu, upravovanie a mazanie vybraných údajov a informácii (ak nie je v zátvorke definované inak).')}
					</p>
					<Collapse defaultActiveKey={defaultActiveKeys} className={'noti-collapse m-0'} bordered={false} ghost expandIconPosition={'right'}>
						{rolesDescriptions.map((salonRole) => {
							const hasPermissions = salonRole?.permissions?.length !== 0
							return (
								<Panel key={salonRole.key} header={<h4 className={'text-base my-2'}>{salonRole.name}</h4>} disabled={!hasPermissions} showArrow={hasPermissions}>
									<SalonRolePermissions permissions={salonRole.permissions} />
								</Panel>
							)
						})}
					</Collapse>
				</Spin>
			</Modal>
		</>
	)
}

export default SalonRolesField
