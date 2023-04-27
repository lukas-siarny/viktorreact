import React, { useState } from 'react'
import { Avatar, Popover } from 'antd'
import { AvatarProps, GroupProps } from 'antd/lib/avatar'
import { SizeContextProvider } from 'antd/lib/avatar/SizeContext'
import { PopoverProps } from 'antd/lib/popover'

type UserAvatarProps = AvatarProps & {
	fallBackSrc?: string
	className?: string
	text?: string
}

const UserAvatar = (props: UserAvatarProps) => {
	const { alt, gap, icon, shape, size, src, srcSet, draggable, crossOrigin, onError, text, className, fallBackSrc, style } = props
	const [loadError, setLoadError] = useState<boolean>(false)

	return (
		<>
			{src ? (
				<Avatar
					className={className}
					alt={alt}
					gap={gap}
					icon={icon}
					shape={shape}
					size={size}
					src={loadError ? fallBackSrc : src}
					srcSet={srcSet}
					draggable={draggable}
					crossOrigin={crossOrigin}
					onError={() => {
						setLoadError(true)
						return true
					}}
					style={{ ...style, flexShrink: 0 }}
				/>
			) : (
				<Avatar
					className={className}
					alt={alt}
					gap={gap}
					icon={icon}
					shape={shape}
					size={size}
					draggable={draggable}
					crossOrigin={crossOrigin}
					onError={onError}
					style={{ ...style, flexShrink: 0 }}
				>
					{text}
				</Avatar>
			)}
		</>
	)
}

type AvatarGroupProps = Omit<GroupProps, 'maxPopoverPlacement'> & {
	avatars: UserAvatarProps[]
	className?: string
	popoverContent?: React.ReactNode
	maxPopoverPlacement?: PopoverProps['placement']
}

/**
 * Based on AntD implementation - add option to define custom popover content
 * @link https://github.com/ant-design/ant-design/blob/master/components/avatar/group.tsx
 */
export const AvatarGroup = (props: AvatarGroupProps) => {
	const { avatars, className, maxCount, maxPopoverPlacement, maxPopoverTrigger, maxStyle, size, popoverContent } = props

	const childrenWithProps = avatars.map((avatarProps, index) => <UserAvatar key={index} {...avatarProps} />)

	const numOfChildren = avatars.length

	if (maxCount && maxCount < numOfChildren) {
		const childrenShow = childrenWithProps.slice(0, maxCount)

		let content = popoverContent

		if (!popoverContent) {
			content = avatars.map((avatarProps, index) => (
				<div key={index} className='mb-2'>
					<UserAvatar {...avatarProps} size={'small'} />
					<span className='s-regular pl-2'>{avatarProps.text}</span>
				</div>
			))
		}

		childrenShow.push(<Avatar key={'max-count-indicator-key'} style={maxStyle}>{`+${numOfChildren - maxCount}`}</Avatar>)

		return (
			<SizeContextProvider size={size}>
				<Popover key='avatar-popover-key' content={content} trigger={maxPopoverTrigger} placement={maxPopoverPlacement}>
					<div className={`ant-avatar-group ${props.className}`} style={props.style}>
						{childrenShow}
					</div>
				</Popover>
			</SizeContextProvider>
		)
	}

	return (
		<Avatar.Group className={className} size={size}>
			{childrenWithProps}
		</Avatar.Group>
	)
}

export default UserAvatar
