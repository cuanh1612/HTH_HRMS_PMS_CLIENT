import * as yup from 'yup'

export const LoginValidate = yup.object({
	email: yup
		.string()
		.required('Please, enter your email')
		.email('Please, Enter the correct email format'),
	password: yup.string().required('Please, enter your password'),
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

export const UpdateProjectNoteValidate = yup.object({
	title: yup.string().required('Please enter field title'),
})

export const CreateProjectTaskValidate = yup.object({
	name: yup.string().required('Please enter field name'),
	start_date: yup.date().required('Please select start date'),
	deadline: yup.date().required('Please select deadline'),
})

export const UpdateProjectTaskValidate = yup.object({
	name: yup.string().required('Please enter field name'),
	start_date: yup.date().required('Please select start date'),
	deadline: yup.date().required('Please select deadline'),
})

