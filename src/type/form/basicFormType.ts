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

export type statusForm = {
	title: string
	color: string
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

export interface ITimePicker {
	required: boolean
	name: string
	placeholder: string
	now?: boolean
	label: string
}

export type AttendanceForm = {
	clock_in_time: string
	clock_out_time: string
	late: boolean
	half_day: boolean
	working_from: string
	[index: string]: any
}

export type createContractFileForm = {
	files: {
		name: string
		public_id: string
		url: string
	}[]
	contract: number
}

export type createEventForm = {
	clientEmails: string[]
	employeeEmails: string[]
	repeatEvery?: number
	typeRepeat: 'Day' | 'Week' | 'Month' | 'Year'
	cycles?: number
	isRepeat: boolean
	starts_on_date: string
	ends_on_date: string
	name: string
	color: string
	where: string
	description: string
	starts_on_time: string
	ends_on_time: string
}

export type updateEventForm = {
	clientEmails: string[]
	employeeEmails: string[]
	repeatEvery?: number
	typeRepeat: 'Day' | 'Week' | 'Month' | 'Year'
	cycles?: number
	isRepeat: boolean
	starts_on_date: string | Date
	ends_on_date: string | Date
	name: string
	color: string
	where: string
	description: string
	starts_on_time: string
	ends_on_time: string
}

export type createProjectForm = {
	project_category?: number
	department?: number
	client?: number
	employees?: number[]
	Added_by?: number
	name: string
	start_date: Date
	deadline: Date
	project_summary?: string
	notes?: string
	project_budget?: number
	hours_estimate?: number
	send_task_noti?: boolean
	currency: 'USD' | 'GBP' | 'EUR' | 'INR' | 'VND'
	project_files?: {
		public_id: string
		url: string
		name: string
	}[]
}

export type updateProjectForm = {
	project_category?: number
	department?: number
	client?: number
	Added_by?: number
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
}

export type createProjetCategoryForm = {
	name: string
}

export type createProjectFileForm = {
	files: {
		name: string
		public_id: string
		url: string
	}[]
	project: number
}

export type updateSalaryForm = {
	amount: number
	type: 'Increment' | 'Decrement' | undefined
	date: Date
	employee: number
}

export type createNoticeBoardForm = {
	notice_to: string
	heading: string
	details: string
}

export type updateNoticeBoardForm = {
	notice_to: string
	heading: string
	details: string
}

export type createProjectDiscussionRoomForm = {
	project_discussion_category: number
	category: number
	title: string
	description: string
	project: number
}

export type createProDiscussionCategoryForm = {
	project_discussion_category: number
	category: number
	title: string
	description: string
	project: number
}

export type createProjectDiscussionCategoryForm = {
	name: string
	color: string
}

export type createProjectDiscussionReplyForm = {
	reply: string
	project: number
	 project_discussion_room: number
}

export type updateProjectDiscussionReplyForm = {
	reply: string
	discussionReplyId: string | number
}

export type createProjectNoteForm = {
	title: string
	note_type: "Public" | "Private"
	employees: number[]
	visible_to_client: boolean
	ask_re_password: boolean
	detail: string
	project: number
}