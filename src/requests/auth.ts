import { loginForm, loginGoogleForm, logoutForm, registerForm, TResetPassword } from 'type/form/basicFormType'
import { authMutaionResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

//-----------------------------------------------------------------
//Request Mutation
//-----------------------------------------------------------------

//Function handle fetch register
export async function registerRequest(inputRegister: registerForm) {
	const resultFetch = await postData<authMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
		body: inputRegister,
	})

	return resultFetch
}

//Function handle fetch login
export async function loginRequest(inputLogin: loginForm) {
	const resultFetch = await postData<authMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_UI_URL}/api/auth/login`,
		body: inputLogin,
	})

	return resultFetch
}

//Function handle fetch login google 
export async function loginGoogleRequest(inputLoginGoogle: loginGoogleForm) {
	const resultFetch = await postData<authMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_UI_URL}/api/auth/login-google`,
		body: inputLoginGoogle,
	})
	return resultFetch
}

//Function handle fetch logout
export async function logoutRequest(inputLogout: logoutForm) {
	const resultFetch = await postData<authMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
		body: inputLogout,
	})

	return resultFetch
}

//-----------------------------------------------------------------
//Request for queries
//-----------------------------------------------------------------

export const currentUserRequest = async (url: string) => {
	return await getData<authMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${url}`,
	})
}


//Function handle re enter password
export async function reEnterPasswordRequest(inputReEnterPassword: {email: string, password: string}) {
	const resultFetch = await postData<authMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/ask-re-enter-password`,
		body: inputReEnterPassword,
	})

	return resultFetch
}

// recover password
export async function recoverPasswordRequest(inputReEnterPassword: {email: string}) {
	const resultFetch = await postData<authMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/recover-password`,
		body: inputReEnterPassword,
	})

	return resultFetch
}

// reset password
export async function resetPasswordRequest(inputReEnterPassword: TResetPassword) {
	const resultFetch = await postData<authMutaionResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
		body: inputReEnterPassword,
	})

	return resultFetch
}