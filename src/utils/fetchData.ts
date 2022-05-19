import axios, { AxiosError, AxiosResponse } from 'axios'
import JWTManager from './jwt'
export interface IPropsFetchData {
	url: string
	body?: any
	params?: any
}

//Config default axios
axios.defaults.withCredentials = true

//Post api
export const postData = async <T = any>({ url, body }: IPropsFetchData) => {
	
	const token = JWTManager.getToken()
	return await axios
		.post(url, body, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
		})
		.then((result: AxiosResponse<T>) => {
			return result.data
		})
		.catch((error: AxiosError) => {
			throw new Error(error.response?.data.message)
		})
}

//Put api
export const putData = async <T = any>({ url, body }: IPropsFetchData) => {
	const token = JWTManager.getToken()
	return await axios
		.put(url, body, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
		})
		.then((result: AxiosResponse<T>) => {
			return result.data
		})
		.catch((error: AxiosError) => {
			throw new Error(error.response?.data.message)
		})
}

//Get api
export const getData = async <T = any>({ url, params }: IPropsFetchData) => {
	const token = JWTManager.getToken()
	return await axios
		.get<any, AxiosResponse<T>>(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			params,
		})
		.then((result) => {
			return result.data
		})
		.catch((error: AxiosError) => {
			throw new Error(error.response?.data.message)
		})
}

//Delete api
export const deleteData = async <T = any>({ url }: IPropsFetchData) => {
	const token = JWTManager.getToken()
	return await axios
		.delete(url, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
		})
		.then((result: AxiosResponse<T>) => {
			return result.data
		})
		.catch((error: AxiosError) => {
			throw new Error(error.response?.data.message)
		})
}
