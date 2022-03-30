import { IconButton } from '@chakra-ui/react'
import React from 'react'
import { IButtonIcon } from 'type/element/commom'

export default function ButtonIcon({ isDisabled = false, handle, ariaLabel, icon }: IButtonIcon) {
	return <IconButton disabled={isDisabled} onClick={handle} aria-label={ariaLabel} icon={icon} />
}
