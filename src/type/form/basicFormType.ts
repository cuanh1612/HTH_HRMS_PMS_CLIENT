export type loginForm = {
	email: string
	password: string
}

export type loginGoogleForm = {
	token: string
}

export type registerForm = {
	email: string
	password: string
	username: string
}

export type logoutForm = {
	userId: string
}

export type createEmployeeForm = {
	employeeId: string
	email: string
	name: string
	password: string
	designation: string
	department: string
	joining_date: Date | string
	hourly_rate: number
	can_login: boolean
	can_receive_email: boolean
	gender: string
	date_of_birth?: Date | string
	country?: string
	mobile: string
	address?: string
	skills?: string[]
	avatar?: {
		name: string
		public_id: string
		url: string
	}
}

export type createLeaveForm = {
	employee: string
	leave_type: string
	status: string
	reason: string
	dates?: Date[]
	duration: string
}

export type updateLeaveForm = {
	employee: string
	leave_type: string
	status: string
	reason: string
	date: Date
	duration: string
}

export type createConversationForm = {
	user_one: string
	user_two: string
}

export type createConversationReplyForm = {
	user: number
	conversation: number
	reply: string
}

export type createLeaveTypeForm = {
	name: string
	color_code: string
	dates?: Date[]
}

export type createDepartmentForm = {
	name: string
}

export type createDesignationForm = {
	name: string
}

export type createDiscussionForm = {
	contract: number
	employee?: number
	client?: number
	content: string
}

export type updateDiscussionForm = {
	discussionId: number
	email_author: string
	content: string
}

export type createContractTypeForm = {
	name: string
}

export type createCategoryForm = {
	name: string
}

export type createSubCategoryForm = {
	name: string
	client_category: number
}

export type updateEmployeeForm = {
	employeeId: string
	email: string
	name: string
	password: string
	designation: string
	department: string
	joining_date: Date | string
	hourly_rate: number
	can_login: boolean
	can_receive_email: boolean
	gender: string
	date_of_birth?: Date | string
	country?: string
	mobile: string
	address?: string
	skills?: string[]
	avatar?: {
		url: string
		name: string
		public_id: string
	}
}

export type createClientForm = {
	salutation: string
	name: string
	email: string
	password: string
	mobile: string
	country: string
	gender: string
	company_name: string
	official_website: string
	gst_vat_number: string
	office_phone_number: string
	city: string
	state: string
	postal_code: string
	company_address: string
	shipping_address: string
	client_category: string
	client_sub_category: string
	can_login: boolean
	can_receive_email: boolean
	avatar?: {
		url: string
		name: string
		public_id: string
	}
}

export type updateClientForm = {
	salutation: string
	name: string
	email: string
	password?: string
	mobile: string
	country: string
	gender: string
	company_name: string
	official_website: string
	gst_vat_number: string
	office_phone_number: string
	city: string
	state: string
	postal_code: string
	company_address: string
	shipping_address: string
	client_category: string
	client_sub_category: string
	can_login: boolean
	can_receive_email: boolean
	avatar?: {
		url: string
		name: string
		public_id: string
	}
	note?: string
}

export type createHolidayForm = {
	holiday_date: string | undefined
	occasion: string
}

export type createUpdateForm = {
	holiday_date: string
	occasion: string
}

export type createHolidaysForm = {
	holidays: createHolidayForm[]
}

export type updateHolidayForm = {
	holiday_date: string | undefined
	occasion: string
}

export type createContractForm = {
	subject: string
	description: string
	start_date: Date
	end_date: Date
	contract_value: number
	contract_type: string
	currency: string
	client: string
	cell: string
	office_phone_number: string
	city: string
	state: string
	country: string
	postal_code: string
	alternate_address: string
	notes: string
	company_logo: {
		url: string
		name: string
		public_id: string
	}
	sign: {
		url: string
		name: string
		public_id: string
	}
}

export type updateContractForm = {
	subject: string
	description: string
	start_date: Date | undefined
	end_date: Date | undefined
	contract_value: number
	contract_type: string
	currency: string
	client: string
	cell: string
	office_phone_number: string
	city: string
	state: string
	country: string
	postal_code: string
	alternate_address: string
	notes: string
	company_logo: {
		url: string
		name: string
		public_id: string
	}
	sign: {
		url: string
		name: string
		public_id: string
	}
}

export interface createSignatureForm {
	first_name: string
	last_name: string
	email: string
	url: string
	public_id: string
	contract: number
}

<<<<<<< HEAD
export interface ITimePicker {
	required: boolean
	name: string
	placeholder: string
	now?: boolean
	label: string
}

export type AttendanceForm = {
	clockIn: string
	clockOut: string
	late: boolean
	halfDay: boolean
	workingFrom: string
=======
export type createContractFileForm = {
	files: {
		name: string
		public_id: string
		url: string
	}[]
	contract: number
>>>>>>> dc5aea6828ba1cfe35f7815babc881a17c4f1772
}
