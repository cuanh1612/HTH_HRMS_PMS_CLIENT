import { departmentType, designationType, userType } from './basicTypes'

export interface authMutaionResponse {
	code: number
	success: boolean
	message: string
	user?: userType
	accessToken?: string
	[index: string]: any
}

export interface userMutaionResponse {
	code: number
	success: boolean
	message: string
	user?: userType
	users?: userType[]
	[index: string]: any
}

export interface employeeMutaionResponse {
	code: number
	success: boolean
	message: string
	user?: userType
	users?: userType[]
	[index: string]: any
}

export interface DepartmentMutaionResponse {
	code: number
	success: boolean
	message: string
	department?: departmentType
	departments?: departmentType[]
	[index: string]: any
}

export interface DesignationMutaionResponse {
	code: number
	success: boolean
	message: string
	designation?: designationType
	designations?: designationType[]
	[index: string]: any
}