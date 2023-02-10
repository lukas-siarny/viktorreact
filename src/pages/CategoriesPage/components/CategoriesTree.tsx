import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataNode } from 'antd/lib/tree'
import { Button, Row, Tree, Divider, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { filter, forEach, get, map, isEmpty, isNil } from 'lodash'
import { initialize } from 'redux-form'
import cx from 'classnames'
import { Key } from 'antd/lib/table/interface'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// reducers
import { getCategories, getCategory } from '../../../reducers/categories/categoriesActions'
import { RootState } from '../../../reducers'

// utils
import { deleteReq, patchReq, postReq } from '../../../utils/request'
import { FORM, NOTIFICATION_TYPE, PERMISSION } from '../../../utils/enums'
import { checkPermissions } from '../../../utils/Permissions'
import { normalizeNameLocalizations } from '../../../utils/helper'

// components
import CategoryForm, { ICategoryForm } from './CategoryForm'
import { EMPTY_NAME_LOCALIZATIONS } from '../../../components/LanguagePicker'

type TreeCategories = {
	title?: ReactElement
	icon?: ReactElement
	key: string
	name: string
	disabled?: boolean
	parentId?: string | null
	children?: TreeCategories[] | null
	nameLocalizations?: any
	level: number
	index: number
	image: any
	deletedAt?: string
	id: string
	isParentDeleted: boolean
}

const editPermissions = [PERMISSION.ENUM_EDIT]

const CategoriesTree = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [showForm, setShowForm] = useState<boolean>(false)
	const [treeNodeData, setTreeNodeData] = useState<any[]>([])
	const [lastOpenedNode, setLastOpenedNode] = useState<any>()
	const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>([])
	const [treeSelectedKeys, setTreeSelectedKeys] = useState<Key[]>([])

	const categories = useSelector((state: RootState) => state.categories.categories)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const values = useSelector((state: RootState) => state.form[FORM.CATEGORY]?.values)

	const openCategoryCreateDetail = (rootParentId: string, parentId: string, parentTitle: string, childrenLength: number, level = 0) => {
		setShowForm(true)
		dispatch(
			initialize(FORM.CATEGORY, {
				parentId,
				parentTitle,
				childrenLength,
				rootParentId,
				nameLocalizations: EMPTY_NAME_LOCALIZATIONS,
				descriptionLocalizations: EMPTY_NAME_LOCALIZATIONS,
				level
			})
		)
	}

	const openCategoryUpdateDetail = async (id: string, levelArg?: number, deletedAt?: string, isParentDeleted?: boolean) => {
		setShowForm(true)
		const { data }: any = await dispatch(getCategory(id))
		let formData = {}
		const level = levelArg ?? lastOpenedNode.level
		if (data) {
			formData = {
				id,
				name: data.name,
				parentId: data.parentID,
				orderIndex: data.orderIndex,
				nameLocalizations: normalizeNameLocalizations(data.nameLocalizations),
				level,
				image: data?.image?.original ? [{ url: data?.image?.original, thumbUrl: data?.image?.resizedImages?.thumbnail, uid: data?.image?.id }] : undefined,
				deletedAt,
				isParentDeleted,
				icon: data?.icon?.original ? [{ url: data?.icon?.original, uid: data?.icon?.id }] : undefined,
				categoryParameterID: data?.categoryParameter?.id,
				descriptionLocalizations: level === 2 ? normalizeNameLocalizations(data?.descriptionLocalizations) : undefined,
				childrenLength: data?.children && data.children.length
			}
		}
		dispatch(initialize(FORM.CATEGORY, formData))
		setLastOpenedNode(formData)
	}

	const deleteCategoryHandler = useCallback(
		async (id: string) => {
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

	const onCategoryClickHandler = (keys: Key[], e: any) => {
		setTreeSelectedKeys(keys)
		if (!checkPermissions(authUserPermissions, editPermissions)) return
		const selectedNode = get(e, 'node')
		openCategoryUpdateDetail(selectedNode?.id, selectedNode?.level, selectedNode?.deletedAt, selectedNode?.isParentDeleted)
	}

	const childrenRecursive = (parentId: string, children: any[], level = 1, isParentDeleted = false) => {
		const childs: TreeCategories[] & any = children
		const items: any = map(childs, (child, index) => {
			const data = {
				id: get(child, 'id'),
				key: get(child, 'id'),
				name: get(child, 'name'),
				disabled: !!get(child, 'deletedAt'),
				parentId,
				children: get(child, 'children') ? childrenRecursive(child.id, get(child, 'children'), level + 1, !!get(child, 'deletedAt')) : null,
				nameLocalizations: get(child, 'nameLocalizations'),
				categoryParameterID: get(child, 'categoryParameter'),
				level,
				index,
				image: get(child, 'image'),
				deletedAt: get(child, 'deletedAt'),
				isParentDeleted
			}
			return { title: get(data, 'name'), ...data }
		})
		return items as any[] & TreeCategories[]
	}

	const treeData = () => {
		const handledData: TreeCategories[] = []
		const level = 0
		forEach(categories?.data, (category: any, index: number) => {
			const data = {
				id: get(category, 'id'),
				key: get(category, 'id'),
				name: get(category, 'name'),
				parentId: null,
				disabled: !!get(category, 'deletedAt'),
				children: get(category, 'children') ? childrenRecursive(get(category, 'id'), get(category, 'children') as any[], 1, !!get(category, 'deletedAt')) : null,
				nameLocalizations: get(category, 'nameLocalizations'),
				categoryParameterID: get(category, 'categoryParameter'),
				level,
				index,
				image: get(category, 'image'),
				deletedAt: get(category, 'deletedAt'),
				isParentDeleted: false
			}

			handledData.push({
				title: get(data, 'name'),
				...data
			})
		})
		setTreeNodeData(handledData as TreeCategories[] & DataNode[])
	}

	useEffect(() => {
		treeData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categories])

	const checkIfParentIsDisabled = (path: string): boolean => {
		const pathArray = path.split('-').map((pathIndex: string) => parseInt(pathIndex, 10))
		if (treeNodeData?.[pathArray[1]]?.children?.[pathArray[2]]) {
			// return disabled for second level
			return treeNodeData?.[pathArray[1]]?.children?.[pathArray[2]].disabled
		}
		// return disabled for first/root level
		return treeNodeData?.[pathArray[1]].disabled
	}

	const notifyUser = () => {
		notification.warning({
			message: t('loc:Upozornenie'),
			description: t('loc:Táto operácia nie je povolená.')
		})
	}

	const onDrop = async (droppedData: any) => {
		// check if dropping category on disabled parent category
		if (checkIfParentIsDisabled(droppedData.node.pos)) {
			notifyUser()
			return
		}
		try {
			// key of dropped node
			// const dropKey: number = droppedData.node.key
			// key of dragged node
			const dragKey: string = droppedData.dragNode.key
			// drag node actual index/position in array children nodes
			const dragPos: string = droppedData.dragNode.pos.split('-')
			const dropPos: string = droppedData.node.pos.split('-')
			// drop index position in drop node children array
			const dropPosition: number = droppedData.dropPosition - Number(dropPos[dropPos.length - 1])
			let body: any = {
				orderIndex: (dropPosition >= 0 ? dropPosition : 0) + 1
			}

			// check condition if user dropped node to gap between nodes
			if (droppedData.dropToGap) {
				// check if drop subcategory to root level
				if (droppedData.dragNode.level > 0 && droppedData.node.level === 0) {
					notification.warning({
						message: t('loc:Upozornenie'),
						description: t('loc:Táto operácia nie je povolená. Hlavnú kategóriu je možné pridať cez tlačidlo "Pridať kategóriu".')
					})
					return
				}

				// check if drop root category to subcategory level
				if (droppedData.dragNode.level === 0 && droppedData.node.level > 0) {
					notifyUser()
					return
				}

				//  dropped node inside of gap between nodes or dropped node to start or end of children nodes array
				let orderIndex: number
				// if drop position is not detected
				if (dropPosition === -1) {
					orderIndex = 1
				} else if (
					Number(dragPos[dragPos.length - 1]) < droppedData.dropPosition &&
					(droppedData.node.props.data.parentId === droppedData.dragNode.props.data.parentId || droppedData.dragNode.props.data.parentId === null)
				) {
					// check if drag position is less than drop position and if is inside same node parent
					orderIndex = droppedData.dropPosition
				} else {
					// if previous condition is not met, count one to the index of drop node
					// dropped node fitted in gap between two node
					orderIndex = droppedData.dropPosition + 1
				}
				// prepare body for request
				body = {
					orderIndex
				}
			}
			// check and update categories on BE
			await patchReq('/api/b2b/admin/enums/categories/{categoryID}/reorder', { categoryID: dragKey }, body)
			dispatch(getCategories())
			setShowForm(false)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleSubmit = async (formData: ICategoryForm) => {
		const cat: any | null = categories?.data
		let descriptionLocalizations: any
		if (!isEmpty(formData.descriptionLocalizations) && formData.descriptionLocalizations.length >= 1 && formData.descriptionLocalizations[0]?.value) {
			descriptionLocalizations = filter(formData.descriptionLocalizations, (item) => !!item.value)
		}

		let orderIndex

		if (!isNil(formData.orderIndex)) {
			orderIndex = formData.orderIndex
		} else if (!isNil(formData.childrenLength)) {
			orderIndex = formData.childrenLength + 1
		} else if (!isNil(cat?.length)) {
			orderIndex = cat.length + 1
		} else {
			orderIndex = 1
		}

		try {
			let body: any = {
				nameLocalizations: filter(formData.nameLocalizations, (item) => !!item.value),
				imageID: (get(formData, 'image[0].id') || get(formData, 'image[0].uid')) ?? undefined,
				iconID: (get(formData, 'icon[0].id') || get(formData, 'icon[0].uid')) ?? undefined,
				categoryParameterID: formData.categoryParameterID ?? undefined,
				descriptionLocalizations
			}

			if (formData.id) {
				await patchReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID: formData.id }, body)
				openCategoryUpdateDetail(formData.id)
			} else {
				if (formData.parentId) {
					body = {
						...body,
						parentID: formData.parentId || undefined
					}
				}
				const { data } = await postReq('/api/b2b/admin/enums/categories/', null, { ...body, orderIndex })
				openCategoryUpdateDetail(data.category.id, (formData?.rootParentId && formData.parentId && 2) || (formData.parentId && 1) || 0)
				// set selected key
				setTreeSelectedKeys([data.category.id])
				// expand related categories
				if (formData?.rootParentId && !treeExpandedKeys.includes(formData.rootParentId)) {
					setTreeExpandedKeys([...treeExpandedKeys, formData.rootParentId])
				}
				if (!treeExpandedKeys.includes(formData.parentId)) {
					setTreeExpandedKeys([...treeExpandedKeys, formData.parentId])
				}
			}
			dispatch(getCategories())
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const formClass = cx({
		'w-6/12': showForm
	})

	// close or reopen parent category if user go back from child category form
	const closeOrOpenParentCategory = () => {
		// check if is actual form data is not same as last opened parent node and also check if is user not closing create root category form
		if (lastOpenedNode?.id !== values?.id && values?.name) {
			dispatch(initialize(FORM.CATEGORY, lastOpenedNode))
			// after init clear
			setLastOpenedNode(null)
		} else {
			// close form
			setShowForm(false)
		}
	}

	return (
		<>
			<Row className={'gap-2'} justify={'space-between'}>
				<h3>{t('loc:Kategórie')}</h3>
				<Button
					onClick={() => {
						dispatch(initialize(FORM.CATEGORY, { nameLocalizations: EMPTY_NAME_LOCALIZATIONS, level: 0 }))
						setShowForm(true)
					}}
					type='primary'
					htmlType='button'
					className={'noti-btn'}
					icon={<PlusIcon />}
				>
					{t('loc:Pridať kategóriu')}
				</Button>
			</Row>
			<div className={'w-full flex'}>
				<div className={formClass}>
					<Tree
						className={'noti-tree'}
						treeData={treeNodeData}
						onDrop={onDrop}
						showIcon
						showLine
						draggable
						onSelect={onCategoryClickHandler}
						onExpand={(expandedKeys) => {
							setTreeExpandedKeys(expandedKeys)
						}}
						selectedKeys={treeSelectedKeys}
						expandedKeys={treeExpandedKeys}
					/>
				</div>
				{showForm ? (
					<div className={'w-6/12 flex justify-around items-start'}>
						<Divider className={'h-full mx-6 xl:mx-9'} type={'vertical'} />
						<CategoryForm
							deleteCategory={deleteCategoryHandler}
							onSubmit={handleSubmit}
							createCategory={openCategoryCreateDetail}
							closeCategoryForm={closeOrOpenParentCategory}
						/>
					</div>
				) : undefined}
			</div>
		</>
	)
}

export default CategoriesTree
