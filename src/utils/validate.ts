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
