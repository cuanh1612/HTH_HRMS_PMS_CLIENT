export interface userType {
	email: string
	username: string
}

export interface employeeType {
	employeeId: number
	email: string
	name: string
	password: string
	designation?: number | designationType
	department?: number | departmentType
	hourly_rate: number
	can_login: boolean
	can_receive_email: boolean
	gender: string
	mobile: string
	country: string
	address: string
	skills?: string[]
	joining_date: Date
	date_of_birth?: Date
	[index: string]: any
}

export interface departmentType {
	id: number
	name: string
	[index: string]: any
}

export interface designationType {
	id: number
	name: string
	[index: string]: any
}

export interface IOption {
	value: string
	lable: string
}

// toast
export type TToast = ({ type, msg }: { type: 'error' | 'success' | 'warning'; msg: string }) => void