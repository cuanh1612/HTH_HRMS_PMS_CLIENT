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

export type createCategoryForm = {
	name: string
}

export type createSubCategoryForm = {
	name: string,
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
