import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataNode } from 'antd/lib/tree'
import { Button, Col, Row, Popover, Tree } from 'antd'
import { useTranslation } from 'react-i18next'
import { get, map, isEmpty } from 'lodash'
import cx from 'classnames'

// assets
import { initialize } from 'redux-form'
import { AntTreeNodeDropEvent } from 'antd/es/tree/Tree'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

// redux
import { getCategories } from '../../../reducers/categories/categoriesActions'
import { RootState } from '../../../reducers'

// utils
import { history } from '../../../utils/history'
import { encodeBackDataQuery } from '../../../utils/helper'
import { deleteReq, patchReq, postReq } from '../../../utils/request'
import { FORM, NOTIFICATION_TYPE, PERMISSION } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// components
import DeleteButton from '../../../components/DeleteButton'
import CategoryForm, { ICategoryForm } from './CategoryForm'

type TreeDestinations = {
	title?: ReactElement
	icon?: ReactElement
	key: number
	name: string
	children?: TreeDestinations[] | null
}

enum TREE_DATA_ACTIONS {
	ADD = 'ADD',
	MOVE = 'MOVE',
	EDIT = 'EDIT'
}

const editPermissions = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_EDIT]
const browsePermissions = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_BROWSING]

const CategoriesTree = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [showForm, setShowForm] = useState<boolean>(false)
	const [treeNodeData, setTreeNodeData] = useState<any[]>([])
	const backUrl = btoa(`${window.location.pathname}${window.location.search}`)

	const nestedDestinations = useSelector((state: RootState) => state.categories.categories)

	const createDestinationHandler = useCallback(
		(parentId: number, parentTitle: string) => {
			setShowForm(true)
			dispatch(initialize(FORM.CATEGORY, { parentId, parentTitle }))
		},
		[dispatch]
	)

	const updateDestinationHandler = useCallback(
		(id: number, title: string, parentId: number, index: number) => {
			setShowForm(true)
			dispatch(initialize(FORM.CATEGORY, { id, name: title, parentId, orderIndex: index }))
		},
		[dispatch]
	)

	const deleteDestinationHandler = useCallback(
		async (id: number) => {
			if (isRemoving) {
				return
			}
			try {
				setIsRemoving(true)
				await deleteReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID: id }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
				dispatch(getCategories())
				setShowForm(false)
				setIsRemoving(false)
			} catch (error: any) {
				// eslint-disable-next-line no-console
				console.error(error.message)
				setIsRemoving(false)
			}
		},
		[dispatch, isRemoving]
	)

	const titleBuilder = (title: string, id: number, parentId: number, index: number) => (
		<Popover
			placement='right'
			trigger='click'
			content={
				<div className={'flex'}>
					<Permissions
						allowed={editPermissions}
						render={(hasPermission, { openForbiddenModal }) => (
							<>
								<Button
									type='link'
									className={'noti-btn icon-center'}
									onClick={hasPermission ? () => createDestinationHandler(id, title) : openForbiddenModal}
									icon={<PlusIcon />}
								/>
								<Button
									type='link'
									className={'noti-btn icon-center'}
									onClick={
										hasPermission
											? () => {
													updateDestinationHandler(id, title, parentId, index)
											  }
											: openForbiddenModal
									}
									icon={<EditIcon />}
								/>
								<DeleteButton
									className={'icon-center'}
									onConfirm={hasPermission ? () => deleteDestinationHandler(id) : openForbiddenModal}
									onlyIcon
									entityName={t('loc:destináciu')}
								/>
							</>
						)}
					/>
				</div>
			}
		>
			<span>{title}</span>
		</Popover>
	)

	const childrenRecursive = (parentId: number, children: any[]) => {
		const childs: TreeDestinations[] & any = children
		const items: any = map(childs, (child, index) => ({
			title: titleBuilder(get(child, 'name'), get(child, 'id'), parentId, parseInt(index, 10)),
			key: get(child, 'id'),
			name: get(child, 'name'),
			children: get(child, 'children') ? childrenRecursive(child.id, get(child, 'children')) : null
		}))
		return items as any[] & TreeDestinations[]
	}

	const treeData = () => {
		const handledData: TreeDestinations[] = []
		map(nestedDestinations?.data, (destination, index) => {
			handledData.push({
				title: titleBuilder(get(destination, 'name'), get(destination, 'id'), -1, parseInt(index, 10)),
				key: get(destination, 'id'),
				name: get(destination, 'name'),
				children: get(destination, 'children') ? childrenRecursive(get(destination, 'id'), get(destination, 'children') as any[]) : null
			})
		})
		setTreeNodeData(handledData as TreeDestinations[] & DataNode[])
	}

	useEffect(() => {
		treeData()
	}, [nestedDestinations])

	// update tree data structure
	const updateTreeData = (data: TreeDestinations[], targetParentKey: number, posIndex: number, addedNode: TreeDestinations, action: TREE_DATA_ACTIONS): TreeDestinations[] => {
		const result: TreeDestinations[] = []
		data.forEach((node: TreeDestinations) => {
			// check and remove moved node => basically removing of moved node
			if (node.key !== addedNode?.key) {
				const updatedNode: TreeDestinations = { ...node }
				let executed = false
				// check for target parent key
				if (targetParentKey === node.key) {
					// add node to parent
					if (action === TREE_DATA_ACTIONS.MOVE) {
						console.log(TREE_DATA_ACTIONS.MOVE)
						updatedNode?.children?.splice(posIndex, 0, addedNode)
					} else if (action === TREE_DATA_ACTIONS.EDIT && !isEmpty(updatedNode.children)) {
						console.log(TREE_DATA_ACTIONS.EDIT)
						let editedNode: any = { ...updatedNode?.children?.[posIndex] }
						editedNode = {
							...editedNode,
							name: addedNode?.name
						}
						updatedNode?.children?.splice(posIndex, 0, editedNode)
					}
					executed = true
				}
				// prevent deeper nesting if target node is updated => executed variable
				if (!isEmpty(node.children) && !executed) {
					// recursively update all children
					updatedNode.children = updateTreeData(node.children || [], targetParentKey, posIndex, addedNode, action)
				}
				result.push({ ...updatedNode })
			} else if (action === TREE_DATA_ACTIONS.ADD) {
				console.log(TREE_DATA_ACTIONS.ADD)
			}
		})
		return result
	}

	const onDrop = async (droppedData: any) => {
		try {
			// key of dropped node
			const dropKey: number = droppedData.node.key
			// key of dragged node
			const dragKey: number = droppedData.dragNode.key
			const dropPos: string = droppedData.node.pos.split('-')
			// drop index position in drop node children array
			const dropPosition: number = droppedData.dropPosition - Number(dropPos[dropPos.length - 1])
			let body: any = {
				name: droppedData.node.name,
				orderIndex: dropPosition + 1
			}
			if (dropKey >= 0) {
				body = {
					...body,
					parentID: dropKey
				}
			}
			// check and update categories on be
			await patchReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID: dragKey }, body)
			// if everything is ok upgrade local state
			setTreeNodeData(updateTreeData(treeNodeData, dropKey, dropPosition, droppedData.dragNode, TREE_DATA_ACTIONS.MOVE))
			setShowForm(false)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleSubmit = async (formData: ICategoryForm) => {
		try {
			let updatedTreeNodeData = []
			let body: any = {
				name: formData.name,
				orderIndex: (formData.orderIndex || 0) + 1
			}
			if (formData.parentId >= 0) {
				body = {
					...body,
					parentID: formData.parentId
				}
			}
			if (!isEmpty(formData.id)) {
				await patchReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID: formData.id }, body)
				updatedTreeNodeData = updateTreeData(
					treeNodeData,
					// if parentID not exist add own key because node is root
					body?.parentID || formData?.orderIndex,
					formData.orderIndex,
					{
						name: formData.name,
						key: formData?.orderIndex
					},
					TREE_DATA_ACTIONS.ADD
				)
			} else {
				const { data }: any = await postReq('/api/b2b/admin/enums/categories/', null, body)
				updatedTreeNodeData = updateTreeData(
					treeNodeData,
					// if parentID not exist add own key because node is root
					body?.parentID || data?.orderIndex,
					data?.orderIndex,
					{
						name: formData.name,
						key: data?.orderIndex
					},
					TREE_DATA_ACTIONS.EDIT
				)
			}
			setTreeNodeData(updatedTreeNodeData)
			setShowForm(false)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const formClass = cx({
		'w-6/12': showForm
	})

	return (
		<>
			<Row className={'flex justify-end'}>
				<Col span={6}>
					<Button
						onClick={() => {
							dispatch(initialize(FORM.CATEGORY, null))
							setShowForm(true)
						}}
						type='primary'
						htmlType='button'
						className={'noti-btn w-full'}
						icon={<PlusIcon />}
					>
						{t('loc:Pridať kategóriu')}
					</Button>
				</Col>
			</Row>
			<div className={'w-full flex'}>
				<div className={formClass}>
					<Tree className={'noti-tree'} treeData={treeNodeData} onDrop={onDrop} showIcon showLine draggable />
				</div>
				{showForm ? (
					<div className={'w-6/12'}>
						<CategoryForm deleteCategory={(id: number) => deleteDestinationHandler(id)} onSubmit={handleSubmit} />
					</div>
				) : undefined}
			</div>
		</>
	)
}

export default CategoriesTree
