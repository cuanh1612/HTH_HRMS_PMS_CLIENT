import { loginForm, loginGoogleForm, logoutForm, registerForm } from 'type/form/auth'
import { authMutaionResponse } from 'type/mutationResponses'
import { getData, postData } from 'utils/fetchData'

//-----------------------------------------------------------------
//Request Mutation
//-----------------------------------------------------------------

//Function handle fetch register
export async function registerRequest(inputRegister: registerForm) {
	const resultFetch = await postData<authMutaionResponse>({
		url: 'http://localhost:4000/api/auth/register',
		body: inputRegister,
	})

	return resultFetch
}

//Function handle fetch login
export async function loginRequest(inputLogin: loginForm) {
	const resultFetch = await postData<authMutaionResponse>({
		url: 'http://localhost:4000/api/auth/login',
		body: inputLogin,
	})

	return resultFetch
}

//Function handle fetch login google 
export async function loginGoogleRequest(inputLoginGoogle: loginGoogleForm) {
	const resultFetch = await postData<authMutaionResponse>({
		url: 'http://localhost:4000/api/auth/login-google',
		body: inputLoginGoogle,
	})

	return resultFetch
}

//Function handle fetch logout
export async function logoutRequest(inputLogout: logoutForm) {
	const resultFetch = await postData<authMutaionResponse>({
		url: 'http://localhost:4000/api/auth/logout',
		body: inputLogout,
	})

	return resultFetch
}

//-----------------------------------------------------------------
//Request for queries
//-----------------------------------------------------------------

export const currentUserRequest = async (url: string) => {
	return await getData<authMutaionResponse>({
		url: `http://localhost:4000/api/auth/${url}`,
	})
}
