import * as yup from 'yup'

export const LoginValidate = yup.object({
    email: yup.string().required('Please, enter your email').email('Please, Enter the correct email format'),
    password: yup.string().required('Please, enter your password'),
}) 

export const CreateEmployeeValidate = yup.object({
    employeeId: yup.string().required('Please enter employee id'),
	email: yup.string().required('Please enter email').email('Please, Enter the correct email format'),
    name: yup.string().required('Please enter employee name'),
    password: yup.string().required('Please enter employee password'),
    designation:  yup.string().required('Please enter employee designation'),
    department:  yup.string().required('Please enter employee department'),
    hourly_rate: yup.number().required('Please enter hourly rate')
}) 