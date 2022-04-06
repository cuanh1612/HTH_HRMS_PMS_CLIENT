import { ReactNode } from "react"

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
	avatar?: {
		url: string,
		public_id: string,
		name: string
	} 
	id: number
}

export interface departmentType {
	id: number
	name: string
	[index: string]: any
}

export interface leaveTypeType {
	id: number
	name: string
	color_code: string
	[index: string]: any
}

export interface leaveType {
	id: number
	name: string
	employee: employeeType
	status: string
	leave_type: leaveTypeType
	duration: string
	reason: string
	date: Date
	[index: string]: any
}

export interface designationType {
	id: number
	name: string
	[index: string]: any
}

export interface clientCategoryType {
	id: number
	name: string
	[index: string]: any
}

export interface clientSubCategoryType {
	id: number
	name: string
	client_category: clientCategoryType
	[index: string]: any
}

export interface clientType {
	salutation?: string
	name: string
	email: string
	password: string
	mobile?: string
	country?: string
	gender?: string
	company_name?: string
	official_website?: string
	gst_vat_number?: string
	office_phone_number?: string
	city?: string
	state?: string
	postal_code?: string
	company_address?: string
	shipping_address?: string
	client_category?: clientCategoryType
	client_sub_category?: clientSubCategoryType
	can_login: boolean
	can_receive_email: boolean
	avatar?: {
		url: string
		name: string
		public_id: string
	}
	id: number
	note?: string
}

export interface IOption {
	value: string
	lable: string
}

// toast
export type TToast = ({ type, msg }: { type: 'error' | 'success' | 'warning'; msg: string }) => void