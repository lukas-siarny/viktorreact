import React, { useState, ReactNode, useCallback } from 'react'
import { Collapse, Button, Badge, Row, Col } from 'antd'
import { black } from 'tailwindcss/colors'
import { ReactComponent as FilterIcon } from '../assets/icons/filter-icon.svg'
import { ROW_GUTTER_X_DEFAULT } from '../utils/enums'

const { Panel } = Collapse

type Props = {
	children?: JSX.Element
	activeFilters?: number
	search?: ReactNode
	customContent?: ReactNode | JSX.Element
	customSearchContent?: ReactNode
	disableFilter?: boolean
}

const Filters = (props: Props) => {
	const { children, activeFilters, search, customContent, customSearchContent, disableFilter } = props
	const [visible, setVisible] = useState<undefined | string>(undefined)

	const onClick = useCallback(() => {
		const activeKey = visible === '1' ? undefined : '1'
		setVisible(activeKey)
	}, [visible])

	return search || customSearchContent ? (
		<Collapse activeKey={visible} ghost className='ghost-filters'>
			<Panel
				header={
					<Row justify={'space-between'} gutter={ROW_GUTTER_X_DEFAULT}>
						<Col span={8}>
							{search && search}
							{!search && customSearchContent}
						</Col>
						<Col span={16}>
							<Row gutter={ROW_GUTTER_X_DEFAULT} justify={'end'} align={'middle'}>
								{children && (
									<Col>
										<Badge count={activeFilters} style={{ top: '8px', right: '10px', background: black }}>
											<Button
												onClick={onClick}
												htmlType='button'
												type='link'
												className={'mr-2 w-full h-full flex items-center'}
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
			{/* // Ak neexistuje search tak zobrazit len children (filtre) bez collapsu lebo lava strana vyzera prazdna a nemusi byt collapsovana eg: inventar/autobusova-doprava/:id/jazdy */}
			{children && children}
		</div>
	)
}

export default Filters
