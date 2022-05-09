import { As } from "@chakra-ui/react"
import { HTMLInputTypeAttribute } from "react"
import { IOption } from "type/basicTypes"


// components/form/input
export interface IInput {
	name: string
	label?: string
	icon?: any
	placeholder?: string
	required?: boolean
	type?: HTMLInputTypeAttribute | undefined
	autoComplete?: "off"
	[index: string]: any
}

export interface IInputNumber {
	name: string
	label: string
	required: boolean
	min?: number
	max?: number
}

export interface ISelect {
	name: string
	label: string
	required: boolean
	placeholder?: string
	options?: IOption[]
	isModal?: boolean
	onOpenModal?: () => void
	disabled?: boolean
	[index: string]: any
}

export interface ICombobox {
	name: string
	label: string
	required: boolean
	options: IOption[]
}

export interface ITextarea {
	name: string
	label: string
	placeholder: string
	required?: boolean
}

// components/form/ButtonIcon
export interface IButtonIcon {
	isDisabled?: boolean
	handle: any
	ariaLabel: string
	icon: any
	hoverBg?: string
	activeBg?: string
	bg?: string
	color?: string
	hoverColor?: string
	activeColor?: string
	radius?: boolean
	as?: As<any>
	htmlFor?: string
}

export interface IPeople {
	id: number | string
	name: string
	avatar: string | undefined
}

export interface ICheckAttendace {
	date: number
	handle?: any
	id?: number
	id_Employee?: number
}