import React from 'react'
import { WrappedFieldProps } from 'redux-form'
import { Tree } from 'antd'
import { DataNode } from 'antd/lib/tree'

type ComponentProps = {
	checkboxGroupStyles?: React.CSSProperties
	horizontal?: boolean
	large?: boolean
	dataTree?: DataNode[]
	label?: string
}

type Props = WrappedFieldProps & ComponentProps

export type NestedMultiselectDataItem = {
	key: number | string
	title: string
	disabled?: boolean
	parentId?: number | null
	children?: DataNode[]
	level: number
	index: number
	id: number
}[]

const CheckboxGroupNestedField = (props: Props) => {
	const { dataTree, input } = props

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
			className={'noti-services-tree'}
			checkable
			blockNode
			onCheck={onCheck}
			checkedKeys={input.value}
			selectable={false}
			treeData={dataTree}
			defaultExpandAll
			// animacie su disabled, pretoze pri zatvarani a otvarani sposobju problemy so stylmi a performance
			// styly, ktore su definovane cez react style proporety (v dataTree pre jednotlive nody) funguju ok, ale styly definovane v nasom cssku sa aplikuju az po dokonceni otvaracej / zatvaracej animacie
			motion={null}
		/>
	)
}

export default CheckboxGroupNestedField
