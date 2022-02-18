import React from 'react'
import { WrappedFieldProps } from 'redux-form'

// ant
import { Tree, Form } from 'antd'
import { FormItemProps } from 'antd/lib/form/FormItem'
import { TreeProps } from 'antd/lib/tree'

const { Item } = Form

type Props = WrappedFieldProps & FormItemProps & TreeProps

const TreeField = (props: Props) => {
	const {
		label,
		required,
		treeData,
		meta: { error, touched },
		disabled,
		input
	} = props

	return (
		<Item label={label} required={required} help={touched && error} validateStatus={error && touched ? 'error' : undefined}>
			<Tree checkedKeys={input.value} checkable onCheck={input.onChange} treeData={treeData} defaultExpandAll disabled={disabled} />
		</Item>
	)
}

export default TreeField
