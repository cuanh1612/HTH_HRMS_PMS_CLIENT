// components/form/input
export interface IInput {
	name: string
	label: string
	icon: any
    placeholder: string
    required?: boolean
	type?: string
}

// components/form/ButtonIcon
export interface IButtonIcon {
	isDisabled?: boolean
	handle: any
	ariaLabel: string
	icon: any
}
