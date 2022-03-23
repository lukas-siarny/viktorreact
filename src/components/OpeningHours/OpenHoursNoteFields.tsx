import React from 'react'
import { Row, Col } from 'antd'
import { Field } from 'redux-form'

// atoms
import DateRangePickerField, { Props as DateProps } from '../../atoms/DateRangePickerField'
import TextareaField from '../../atoms/TextareaField'

type Props = {
	size?: string
	name?: string
	datePlaceholder?: DateProps['placeholder']
	dateLabel?: string
	textAreaPlaceholder?: string
	textAreaLabel?: string
}

const OpenHoursNoteFields = (props: Props) => {
	const { datePlaceholder, dateLabel, textAreaPlaceholder, textAreaLabel, size, name = 'hoursNote' } = props

	return (
		<>
			<Row>
				<Col span={24}>
					<Field component={DateRangePickerField} disablePast name={`${name}.range`} placeholder={datePlaceholder} label={dateLabel} size={size} />
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<Field component={TextareaField} name={`${name}.note`} placeholder={textAreaPlaceholder} label={textAreaLabel} size={size} />
				</Col>
			</Row>
		</>
	)
}

export default OpenHoursNoteFields
