import React, { Dispatch, FC } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Modal } from 'antd'

// utils
import { FORM } from '../../../utils/enums'

// components
import EmployeeServiceEditForm from './EmployeeServiceEditForm'

// types
import { RootState } from '../../../reducers'

// schema
import { IEmployeeServiceEditForm } from '../../../schemas/service'

type Props = {
	visible: boolean
	setVisible: (visible: boolean) => void
	editEmployeeService: (values: IEmployeeServiceEditForm, _dispatch?: Dispatch<any>, customProps?: any) => void
	loading: boolean
}

const ServiceEditModal: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { visible, setVisible, editEmployeeService, loading } = props
	const editServiceformValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE_SERVICE_EDIT]?.values) as IEmployeeServiceEditForm

	return (
		<Modal
			title={t('loc:Úprava služby pre zamestnanca')}
			className={'edit-employee-service-modal'}
			width={600}
			open={visible}
			forceRender
			onCancel={() => setVisible(false)}
			footer={null}
		>
			<EmployeeServiceEditForm
				onSubmit={editEmployeeService}
				loading={loading}
				onResetData={() => editEmployeeService(editServiceformValues, undefined, { resetUserServiceData: true })}
			/>
		</Modal>
	)
}
export default ServiceEditModal
