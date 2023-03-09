import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import { PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import EmployeesFilter from './EmployeesFilter'
import { getLinkWithEncodedBackUrl } from '../../../utils/helper'
import CustomTable from '../../../components/CustomTable'

type Props = {
	extraContent?: JSX.Element
}

const DeletedEmployeesTable = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { extraContent } = props
	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body'>
					<Spin spinning={employees?.isLoading}>
						<Permissions
							allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<EmployeesFilter
									createEmployee={() => {
										if (hasPermission) {
											navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:employees/create')))
										} else {
											openForbiddenModal()
										}
									}}
									onSubmit={handleSubmit}
								/>
							)}
						/>

						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={employees?.tableData}
							rowClassName={'clickable-row'}
							dndDrop={handleDrop}
							twoToneRows
							scroll={{ x: 800 }}
							onRow={(record) => ({
								onClick: () => {
									navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:employees/{{employeeID}}', { employeeID: record.id })))
								}
							})}
							useCustomPagination
							pagination={{
								pageSize: employees?.data?.pagination?.limit,
								total: employees?.data?.pagination?.totalCount,
								current: employees?.data?.pagination?.page,
								onChange: onChangePagination,
								disabled: employees?.isLoading
							}}
						/>
					</Spin>
				</div>
			</Col>
		</Row>
	)
}

export default DeletedEmployeesTable
