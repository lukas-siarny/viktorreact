import React, { useState, ReactNode, useCallback } from 'react'
import { Collapse, Button, Badge, Row, Col } from 'antd'
import { ReactComponent as FilterIcon } from '../assets/icons/filter-icon.svg'
import { FILTER_BUTTON_ID, FORM, ROW_GUTTER_X_DEFAULT } from '../utils/enums'
import { formFieldID } from '../utils/helper'

const { Panel } = Collapse

type Props = {
	children?: JSX.Element
	activeFilters?: number
	search?: ReactNode
	customContent?: ReactNode | JSX.Element
	customSearchContent?: ReactNode
	disableFilter?: boolean
	form?: FORM
	forceRender?: boolean
}

const Filters = (props: Props) => {
	const { children, activeFilters, search, customContent, customSearchContent, disableFilter, form, forceRender = false } = props
	const [visible, setVisible] = useState<undefined | string>(undefined)

	const onClick = useCallback(() => {
		const activeKey = visible === '1' ? undefined : '1'
		setVisible(activeKey)
	}, [visible])

	return (search || customSearchContent) && (customContent || children) ? (
		<Collapse collapsible={'disabled'} activeKey={visible} ghost className='ghost-filters'>
			<Panel
				forceRender={forceRender}
				header={
					<Row className={'mb-4'} justify={'space-between'} gutter={ROW_GUTTER_X_DEFAULT}>
						<Col span={8}>
							{search && search}
							{!search && customSearchContent}
						</Col>
						<Col span={16}>
							<Row gutter={ROW_GUTTER_X_DEFAULT} justify={'end'} align={'middle'}>
								{children && (
									<Col>
										<Badge count={activeFilters} className={'mr-1'} style={{ top: '8px', right: '10px', background: '#DC0069' }}>
											<Button
												id={formFieldID(form, FILTER_BUTTON_ID)}
												onClick={onClick}
												htmlType='button'
												type='link'
												className={'noti-filter-button w-full h-full px-1 flex items-center'}
												disabled={disableFilter}
												icon={<FilterIcon className={'text-gray-600 hover:text-gray-900'} />}
											/>
										</Badge>
									</Col>
								)}
								<Col>{customContent}</Col>
							</Row>
						</Col>
					</Row>
				}
				showArrow={false}
				key='1'
			>
				{/* // NOTE: children - list of filter Fields have to be in Row wrapper with Cols */}
				{children}
			</Panel>
		</Collapse>
	) : (
		<div>
			{/* // Ak exsituje len search */}
			<Col span={24} lg={12} xl={8}>
				{search || customSearchContent}
			</Col>
			{/* // Ak exsituje len children - search a children tu nikdy nebudu naraz, pretoze podmienka vyssie to nedovoli */}
			{children && children}
		</div>
	)
}

export default Filters
