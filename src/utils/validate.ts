import * as yup from 'yup'

export const LoginValidate = yup.object({
	email: yup
		.string()
		.required('Please, enter your email')
		.email('Please, Enter the correct email format'),
	password: yup.string().required('Please, enter your password'),
})

export const recoverPassValidate = yup.object({
	email: yup
		.string()
		.required('Please, enter your email')
		.email('Please, Enter the correct email format'),
})

export const CreateEmployeeValidate = yup.object({
	employeeId: yup.string().required('Please enter employee id'),
	email: yup
		.string()
		.required('Please enter email')
		.email('Please, Enter the correct email format'),
	name: yup.string().required('Please enter employee name'),
	password: yup.string().required('Please enter employee password'),
	designation: yup.string().required('Please enter employee designation'),
	department: yup.string().required('Please enter employee department'),
	hourly_rate: yup.number().required('Please enter hourly rate'),
})

export const UpdateEmployeeValidate = yup.object({
	employeeId: yup.string(),
	email: yup.string(),
	name: yup.string(),
	password: yup.string(),
	designation: yup.string(),
	department: yup.string(),
	hourly_rate: yup.number(),
})

export const CreateDepartmentValidate = yup.object({
	name: yup.string().required('Please enter employee name'),
})

export const CreateLeaveValidate = yup.object({
	employee: yup.string().required('Please select employee'),
	leave_type: yup.string().required('Please select leave type'),
	status: yup.string().required('Please select status'),
	reason: yup.string().required('Please enter reason absence'),
})

export const CreateCurrentLeaveValidate = yup.object({
	leave_type: yup.string().required('Please select leave type'),
	status: yup.string().required('Please select status'),
	reason: yup.string().required('Please enter reason absence'),
})

export const UpdateLeaveValidate = yup.object({
	employee: yup.string().required('Please select employee'),
	leave_type: yup.string().required('Please select leave type'),
	status: yup.string().required('Please select status'),
	reason: yup.string().required('Please enter reason absence'),
})

export const CreateLeaveTypeValidate = yup.object({
	name: yup.string().required('Please enter name leave type'),
	color_code: yup.string().required('Please enter color code'),
})

export const CreateClientValidate = yup.object({
	email: yup
		.string()
		.required('Please enter email')
		.email('Please, Enter the correct email format'),
	name: yup.string().required('Please enter client name'),
	password: yup.string().required('Please enter client password'),
})

export const UpdateClientValidate = yup.object({
	email: yup
		.string()
		.required('Please enter email')
		.email('Please, Enter the correct email format'),
	name: yup.string().required('Please enter client name'),
})

export const CreateContractValidate = yup.object({
	subject: yup.string().required('Please enter field subject'),
	start_date: yup.date().required('Please select start date'),
	contract_value: yup.number().required('Please enter field subject conctract value'),
	currency: yup.string().required('Please select currency'),
	client: yup.string().required('Please select client'),
})

export const UpdateContractValidate = yup.object({
	subject: yup.string().required('Please enter field subject'),
	start_date: yup.date().required('Please select start date'),
	contract_value: yup.number().required('Please enter field subject conctract value'),
	currency: yup.string().required('Please select currency'),
	client: yup.string().required('Please select client'),
})

export const CreateSignatureValidate = yup.object({
	first_name: yup.string().required('Please enter field first name'),
	last_name: yup.string().required('Please enter field last name'),
	email: yup.string().required('Please enter field email'),
})

export const createConversationValidate = yup.object({
	user_two: yup.string().required('Please select other employee to create conversation'),
})

export const createEventValidate = yup.object({
	name: yup.string().required('Please enter field name event'),
	color: yup.string().required('Please enter field color'),
	where: yup.string().required('Please enter field where'),
	starts_on_date: yup.date().required('Please sele3ct start on date event'),
	ends_on_date: yup.date().required('Please enter field end on date event'),
	employeeEmails: yup.array().required('Please select employees for event'),
	clientEmails: yup.array().required('Please select clients for event'),
})

export const updateEventValidate = yup.object({
	name: yup.string().required('Please enter field name event'),
	color: yup.string().required('Please enter field color'),
	where: yup.string().required('Please enter field where'),
	starts_on_date: yup.date().required('Please sele3ct start on date event'),
	ends_on_date: yup.date().required('Please enter field end on date event'),
})

export const AttendanceValidate = yup.object({
	clock_in_time: yup.string().required('Please, enter clock in'),
	clock_out_time: yup.string().required('Please, enter clock out'),
})

export const createProjectValidate = yup.object({
	name: yup.string().required('Please enter field name event'),
	start_date: yup.date().required('Please select start on date project'),
	deadline: yup.date().required('Please select deadline event'),
})

export const updateSalaryValidate = yup.object({
	amount: yup.number().min(1).required('Please enter field amount salary'),
	date: yup.date().required('Please select start on date project'),
	type: yup.string().required('Please select value type'),
})

export const createNoticeBoardValidate = yup.object({
	heading: yup.string().required('Please enter field heading notice board'),
})

export const updateNoticeBoardValidate = yup.object({
	heading: yup.string().required('Please enter field heading notice board'),
})

export const CreateProjectDiscussionRoomValidate = yup.object({
	title: yup.string().required('Please enter field title'),
})

export const CreateStatusColumnValidate = yup.object({
	title: yup.string().required('Please enter field title'),
	color: yup.string().required('Please enter field color'),
})

export const CreateProjectNoteValidate = yup.object({
	title: yup.string().required('Please enter field title'),
})

export const milestoneValidate = yup.object({
	cost: yup.number().required('Please enter add to budget'),
	title: yup.string().required('Please enter title'),
	summary: yup.string().required('Please enter summary'),
})

export const UpdateProjectNoteValidate = yup.object({
	title: yup.string().required('Please enter field title'),
})

export const CreateProjectTaskValidate = yup.object({
	name: yup.string().required('Please enter field name'),
	start_date: yup.date().required('Please select start date'),
	deadline: yup.date().required('Please select deadline'),
	project: yup.number(),
	status: yup.number().required('Please select status'),
})

export const UpdateProjectTaskValidate = yup.object({
	name: yup.string().required('Please enter field name'),
	start_date: yup.date().required('Please select start date'),
	deadline: yup.date().required('Please select deadline'),
})

export const CreateProjectTimeLogValidate = yup.object({
	starts_on_date: yup.date().required('Please select start date'),
	ends_on_date: yup.date().required('Please select end date'),
	memo: yup.string().required('Please enter field memo'),
	employee: yup.number().required('Please select employee'),
	task: yup.number().required('Please select task'),
})

export const validateResetPass = yup.object({
	password: yup
		.string()
		.required('Please Enter your password')
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
			'Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
		),
	passwordConfirm: yup
		.string()
		.label('Password Confirm')
		.required()
		.oneOf([yup.ref('password')], 'Passwords does not match'),
})

export const updateStatusProjectValidate = yup.object({
	project_status: yup.string().required('Please select project'),
})

export const createStickyNoteValidate = yup.object({
	color: yup.string().required('Please select color sticky note'),
})

export const updateStickyNoteValidate = yup.object({
	color: yup.string().required('Please select color sticky note'),
})

export const createRoomValidate = yup.object({
	title: yup
		.string()
		.required('Please enter field title')
		.matches(/^[^-\s][a-zA-Z0-9_\s-]+$/, 'This field cannot contain special character'),
	date: yup.date().required('Please select start on date'),
	description: yup.string().required('Please enter field description'),
	employees: yup.array().required('Please select employees'),
	clients: yup.array().required('Please select clients'),
})

export const updateRoomValidate = yup.object({
	title: yup
		.string()
		.required('Please enter field title')
		.matches(/^[^-\s][a-zA-Z0-9_\s-]+$/, 'This field cannot contain and special character'),
	date: yup.date().required('Please select start on date'),
	description: yup.string().required('Please enter field description'),
	employees: yup.array().required('Please select employees'),
	clients: yup.array().required('Please select clients'),
})

export const CreateJobValidate = yup.object({
	title: yup.string().required('Please enter field title'),
	skills: yup.array().length(1).required('Please select skills for job'),
	locations: yup.array().length(1).required('Please select locations for job'),
	department: yup.number().required('Please select department for job'),
	total_openings: yup.number().min(0).required('Please select department for job'),
	job_type: yup.number().required('Please select job type for job'),
	work_experience: yup.number().required('Please select work experience for job'),
	recruiter: yup.number().required('Please select department for job'),
	starting_salary_amount: yup.number().min(0).required('Please select department for job'),
	starts_on_date: yup.date().required('Please select starts on date'),
	ends_on_date: yup.date().required('Please select ends ondate'),
	rate: yup.string().required('Please select job rate'),
})

export const UpdateJobValidate = yup.object({
	title: yup.string().required('Please enter field title'),
	skills: yup.array().min(1).required('Please select skills for job'),
	locations: yup.array().min(1).required('Please select locations for job'),
	department: yup.number().required('Please select department for job'),
	total_openings: yup.number().min(0).required('Please select department for job'),
	job_type: yup.number().required('Please select job type for job'),
	work_experience: yup.number().required('Please select work experience for job'),
	recruiter: yup.number().required('Please select department for job'),
	starting_salary_amount: yup.number().min(0).required('Please select department for job'),
	starts_on_date: yup.date().required('Please select starts on date'),
	ends_on_date: yup.date().required('Please select ends ondate'),
	rate: yup.string().required('Please select job rate'),
})

export const CreateJobApplicationValidate = yup.object({
	name: yup.string().required('Please enter field name'),
	email: yup
		.string()
		.required('Please, enter email')
		.email('Please, Enter the correct email format'),
	mobile: yup.string().required('Please enter field mobile'),
	status: yup.string().required('Please select status'),
	source: yup.string().required('Please select status'),
	jobs: yup.number().required('Please select job'),
	location: yup.number().required('Please select location'),
})

export const UpdateJobApplicationValidate = yup.object({
	name: yup.string().required('Please enter field name'),
	email: yup
		.string()
		.required('Please, enter email')
		.email('Please, Enter the correct email format'),
	mobile: yup.string().required('Please enter field mobile'),
	status: yup.string().required('Please select status'),
	source: yup.string().required('Please select status'),
	jobs: yup.number().required('Please select job'),
	location: yup.number().required('Please select location'),
})

export const changeSkillsJobApplicationValidate = yup.object({
	skills: yup.array().min(1).required('Please select skills for job application'),
})

export const CreateInterviewValidate = yup.object({
	date: yup.date().required('Please select start date'),
	candidate: yup.number().required('Please select candidate'),
	interviewer: yup.array().min(1).required('Please select interviewer'),
	start_time: yup.string().required('Please select start time'),
	type: yup.string().required('Please select interview type'),
})

export const CreateJobOfferValidate = yup.object({
	job:  yup.number().required('Please select job'),
	job_application:  yup.number().required('Please select job application'),
	exprise_on: yup.date().required('Please select job offer exprise on date'),
	expected_joining_date: yup.date().required('Please select job offer expected joining date'),
	salary: yup.number().min(1).required('Please enter job offer salary'),
	rate: yup.string().required('Please select rate')
})

export const UpdateJobOfferValidate = yup.object({
	job:  yup.number().required('Please select job'),
	job_application:  yup.number().required('Please select job application'),
	exprise_on: yup.date().required('Please select job offer exprise on date'),
	expected_joining_date: yup.date().required('Please select job offer expected joining date'),
	salary: yup.number().min(1).required('Please enter job offer salary'),
	rate: yup.string().required('Please select rate'),
	status: yup.string().required('Please select job offer status')
})