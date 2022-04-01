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
}

export type createDepartmentForm = {
	name: string
}

export type createDesignationForm = {
	name: string
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
}
