import { ReactNode } from 'react'

export interface roomType {
	title: string
	description: string
	id: number
	start_time: string
	date: Date
	link: string
	empl_create: employeeType
	employees: employeeType[]
	clients: clientType[]
}

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

export interface Hourly_rate_project {
	id: number
	hourly_rate: number
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
		id: number
		url: string
		public_id: string
		name: string
	}
	id: number
	role: string
	attendances: attendanceType[]
	salaries: salaryType[]
	hourly_rate_project: Hourly_rate_project
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

export interface milestoneType {
	id: number
	title: string
	cost: number
	addtobudget: boolean | number
	status: boolean | number
	summary: string
	tasks: taskType[]
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
		id: number
		url: string
		name: string
		public_id: string
	}
	id: number
	note?: string
	createdAt: Date
	updatedAt: Date
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
		id: number
		url: string
		name: string
		public_id: string
	}
	sign?: {
		id: number
		url: string
		first_name: string
		last_name: string
		public_id: string
	}
	contract_type?: contractTypeType
	createdAt: Date
	updatedAt: Date
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
	value?: string | number
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
	createdAt: Date
	updatedAt: Date
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

export interface statusType {
	id: number
	color: string
	index: number
	root: boolean
	title: string
	count?: number
	tasks?: taskType[]
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
	send_task_noti: boolean
	project_status?: 'Not Started' | 'In Progress' | 'On Hold' | 'Canceled' | 'Finished'
	currency: 'USD' | 'GBP' | 'EUR' | 'INR' | 'VND'
	Progress: number
	project_files?: projectFileType[]
	project_Admin: employeeType
	createdAt: Date
	updatedAt: Date
}

export interface UserAttendance {
	id: number
	name: string
	avatar: string
	designation: string
	date: Date
}

export interface IContractUrls {
	summary: string
	discussion: string
	files: string
}

export interface projectFileType {
	id: number
	url: string
	name: string
	public_id: string
	contract: contractType
	createdAt: Date
	assignBy?: employeeType
}

export interface taskFileType {
	id: number
	url: string
	name: string
	public_id: string
	createdAt: Date
}

export interface salaryType {
	id: number
	date: Date
	type: 'Increment' | 'Decrement' | '' | undefined
	employee: employeeType
	amount: number
	[index: string]: any
}

export interface noticeBoardType {
	id: number
	heading: string
	notice_to: string
	details: string
	[index: string]: any
}

export interface projectDiscussionCategoryType {
	id: number
	name: string
	[index: string]: any
}

export interface projectDiscussionReplyType {
	id: number
	employee: employeeType
	reply: string
}

export interface projectDiscussionRoomType {
	id: number
	project_discussion_replies: projectDiscussionReplyType[]
	project_discussion_category: projectDiscussionCategoryType
	project: projectType
	assigner: employeeType
	title: String
	createdAt: Date
	[index: string]: any
}

export interface projectDiscussionCategoryType {
	id: number
	name: string
	color: string
}

export interface projectDiscussionReplyType {
	id: number
	employee: employeeType
	project_discussion_room: projectDiscussionRoomType
	reply: string
	createdAt: Date
	[index: string]: any
}

export interface projectNoteType {
	id: number
	note_type: string
	employees?: employeeType[]
	project: projectType
	detail?: string
	title: string
	visible_to_client: boolean
	ask_re_password: boolean
	createdAt: Date
	[index: string]: any
}

export interface taskCategoryType {
	id: number
	name: string
	[index: string]: any
}

export interface taskType {
	id: number
	name: string
	start_date: Date
	deadline: Date
	index: number
	task_category: taskCategoryType
	project: projectType
	employees: employeeType[]
	description: string
	priority: string
	milestone?: milestoneType
	assignBy: employeeType
	tasks?: taskType[]
	task_files?: {
		url: string
		public_id: string
		name: string
	}[]
	status: statusType
	createdAt: Date
	updatedAt: Date
	[index: string]: any
}

export interface taskCommentType {
	id: number
	employee: employeeType
	content: string
	task?: taskType
	createdAt: Date
}

export interface timeLogType {
	id: number
	project: projectType
	task?: taskType
	employee?: employeeType
	starts_on_date: Date
	ends_on_date: Date
	starts_on_time: string
	ends_on_time: string
	memo: string
	total_hours: number
	earnings: Number
	createdAt: Date
	updatedAt: Date
}

export interface stickyNoteType {
	id: number
	color: string
	note: string
	employee?: employeeType
}

export interface notificationType {
	id: number
	content: string
	url: string
	employee?: employeeType
	client?: clientType
	createdAt: Date
	updatedAt: Date
}

export interface ImessageRoom {
	name: string
	text?: string
	time: string
	id: number
	field?: string
	isField?: boolean
	peerId?: string
}

export interface IEmoji {
	slug: string
	character: string
	unicodeName: string
	codePoint: string
	group: string
	subGroup: string
}

export interface companyInfoType {
	id: number
	name: string
	phone: string
	email: string
	website: string
}
export interface ITile {
	id: string
	isCurrentUser: boolean
}

export interface skillType {
	id: number
	name: string
}

export interface locationType {
	id: number
	name: string
	jobs?: jobType[]
	createdAt: Date
	updatedAt: Date
}

export interface jobTypeType {
	id: number
	name: string
	jobs?: jobType
	createdAt: Date
	updatedAt: Date
}

export interface workExperienceType {
	id: number
	name: string
	jobs?: jobType[]
	createdAt: Date
	updatedAt: Date
}

export interface jobType {
	id: number
	title: string
	starts_on_date: Date
	ends_on_date: Date
	skills: skillType[]
	locations: locationType[]
	department: departmentType
	status: boolean
	total_openings: number
	job_type: jobTypeType
	work_experience: workExperienceType
	recruiter: employeeType
	starting_salary_amount: number
	job_description?: string
	rate: string
}

export interface jobApplicationType {
	id: number
	name: string
	email: string
	mobile: number
	picture: {
		id: number
		url: string
		public_id: string
		name: string
	}
	cover_leter: string
	status: string
	source: string
	jobs: jobType
	location: locationType
	createdAt: Date
	updatedAt: Date
	skills?: skillType[]
}

export interface interviewType {
	id: number
	date: Date
	candidate: jobApplicationType
	interviewer: employeeType[]
	comment?: string
	start_time: string
	type: string
	status: string
	createdAt: Date
	updatedAt: Date
}

export interface interviewFileType {
	id: number
	url: string
	name: string
	public_id: string
	createdAt: Date
}

export interface jobOfferLetterType {
	id: number
	job: jobType
	job_application: jobApplicationType
	exprise_on: Date
	expected_joining_date: Date
	salary: number
	status: string
	rate: string
	token: string
	sign?: {
		id: number
		url: string
		first_name: string
		last_name: string
		public_id: string
	}
}

export interface jobApplicationFileType {
	id: number
	url: string
	name: string
	public_id: string
	createdAt: Date
}
