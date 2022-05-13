import { ReactNode } from 'react'

export interface userType {
	email: string
	username: string
}

export interface attendanceType {
	id: number
	working_from: string
	clock_in_time: string
	clock_out_time: string
	date: Date
	late: boolean
	half_day: boolean
	[index: string]: any
}

export interface employeeType {
	employeeId: number
	email: string
	name: string
	designation?: designationType
	department?: departmentType
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
		url: string
		public_id: string
		name: string
	}
	id: number
	role: string
	attendances: attendanceType[]
}

export interface departmentType {
	id: number
	name: string
	[index: string]: any
}

export interface conversationType {
	id: number
	employees: employeeType[]
	[index: string]: any
}

export interface conversationReplyType {
	id: number
	user: employeeType
	coversation: conversationType
	rely: string
	createdAt: Date
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

export interface signType {
	id: number
	first_name: string
	last_name: string
	email: string
	url: string
	public_id: string
}

export interface designationType {
	id: number
	name: string
	[index: string]: any
}

export interface discussionType {
	id: number
	employee?: employeeType
	client?: clientType
	content: string
	contract: contractType
	createdAt: Date
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

export interface holidayType {
	id: number
	holiday_date: Date
	occasion: string
	[index: string]: any
}

export interface contractType {
	id: number
	subject: string
	description?: string
	start_date: Date
	end_date?: Date
	contract_value: number
	currency: string
	client: clientType
	cell?: string
	office_phone_number?: string
	city?: string
	state?: string
	country?: string
	postal_code?: string
	alternate_address?: string
	notes?: string
	company_logo?: {
		url: string
		name: string
		public_id: string
	}
	sign?: {
		url: string
		first_name: string
		last_name: string
		public_id: string
	}
	contract_type?: contractTypeType
}

export interface contractTypeType {
	id: number
	name: string
	[index: string]: any
}

export interface contractFileType {
	id: number
	url: string
	name: string
	public_id: string
	contract: contractType
	createdAt: Date
}

export interface IOption {
	value: string | number
	label: string | ReactNode
}

// toast
export type TToast = ({ type, msg }: { type: 'error' | 'success' | 'warning'; msg: string }) => void

export interface leaveDate {
	id: number
	id_employee: number
	date: number
}

export interface eventType {
	id: number
	clients: clientType[]
	employees: employeeType[]
	starts_on_date: Date
	starts_on_time: string
	ends_on_date: Date
	ends_on_time: string
	name: string
	color: string
	where: string
	description: string
}

export interface ITime {
	time: string
	hours: number
	minutes: number
	AMOrPM: string
}

export interface projectCategoryType {
	id: number
	name: string
	[index: string]: any
}

export interface projectFileType {
	id: number
	url: string
	name: string
	public_id: string
	project: projectType
	createdAt: Date
}

export interface projectType {
	id: number
	project_category?: projectCategoryType
	department?: departmentType
	client?: clientType
	employees?: employeeType[]
	Added_by?: employeeType
	name: string
	start_date: Date
	deadline: Date
	project_summary?: string
	notes?: string
	project_budget?: number
	hours_estimate?: number
	send_task_noti?: boolean
	project_status?: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Finished'
	currency: 'USD' | 'GBP' | 'EUR' | 'INR' | 'VND'
	Progress: number
	project_files?: projectFileType[]
}

export interface UserAttendance {
	id: number
	name: string
	avatar: string
	designation: string
	date: Date
}
