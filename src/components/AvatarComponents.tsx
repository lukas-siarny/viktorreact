import React from 'react'
import { Avatar } from 'antd'
import { AvatarProps, GroupProps } from 'antd/lib/avatar'

type UserAvatarProps = AvatarProps & {
	className?: string
	text?: string
}

const UserAvatar = (props: UserAvatarProps) => {
	const { alt, gap, icon, shape, size, src, srcSet, draggable, crossOrigin, onError, text, className } = props

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
					src={src}
					srcSet={srcSet}
					draggable={draggable}
					crossOrigin={crossOrigin}
					onError={onError}
				/>
			) : (
				<Avatar className={className} alt={alt} gap={gap} icon={icon} shape={shape} size={size} draggable={draggable} crossOrigin={crossOrigin} onError={onError}>
					{text}
				</Avatar>
			)}
		</>
	)
}

type AvatarGroupProps = GroupProps & {
	avatars: UserAvatarProps[]
	className?: string
}

export const AvatarGroup = (props: AvatarGroupProps) => {
	const { avatars, className, maxCount, maxPopoverPlacement, maxPopoverTrigger, maxStyle, size } = props

	return (
		<Avatar.Group className={className} maxCount={maxCount} maxPopoverPlacement={maxPopoverPlacement} maxPopoverTrigger={maxPopoverTrigger} maxStyle={maxStyle} size={size}>
			{avatars.map((avatarProps) => (
				<UserAvatar {...avatarProps} />
			))}
		</Avatar.Group>
	)
}

export default UserAvatar
