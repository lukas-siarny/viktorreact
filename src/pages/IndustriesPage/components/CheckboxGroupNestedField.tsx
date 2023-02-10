import React from 'react'
import { WrappedFieldProps } from 'redux-form'
import { Tree } from 'antd'
import { DataNode, TreeProps } from 'antd/lib/tree'
import cx from 'classnames'

type ComponentProps = TreeProps & {
	checkboxGroupStyles?: React.CSSProperties
	horizontal?: boolean
	large?: boolean
	dataTree?: DataNode[]
	className?: string
}

type Props = WrappedFieldProps & ComponentProps

export type NestedMultiselectDataItem = {
	key: number | string
	title: string
	disabled?: boolean
	parentId?: string | null
	children?: DataNode[]
	level: number
	index: number
	id: string
}[]

const CheckboxGroupNestedField = (props: Props) => {
	const { dataTree, input, checkable = true, defaultExpandedKeys, className, disabled } = props

	const onCheck = (
		checked:
			| React.Key[]
			| {
					checked: React.Key[]
					halfChecked: React.Key[]
			  }
	) => {
		input.onChange(checked)
	}

	return (
		<Tree
			className={cx(className, 'noti-services-tree')}
			checkable={checkable}
			blockNode
			onCheck={onCheck}
			defaultExpandedKeys={defaultExpandedKeys}
			checkedKeys={input.value}
			selectable={false}
			treeData={dataTree}
			defaultExpandAll
			disabled={disabled}
			// ak budu animacie robit problemy tak sa daju vypnut, ale nie je to ofic zdokumentovana propa
			// motion={null}
		/>
	)
}

export default CheckboxGroupNestedField
