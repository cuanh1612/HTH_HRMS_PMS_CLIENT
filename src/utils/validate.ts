import * as yup from 'yup'

export const LoginValidate = yup.object({
    email: yup.string().required('Please, enter your email').email('Please, Enter the correct email format'),
    password: yup.string().required('Please, enter your password'),
}) 