import React from 'react'
import { Avatar } from 'antd'
import { AvatarProps } from 'antd/lib/avatar'

type Props = AvatarProps & {
	className?: string
	text?: string
}

const UserAvatar = (props: Props) => {
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

export default UserAvatar
