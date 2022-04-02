import { departmentType, designationType, employeeType, leaveType, leaveTypeType, userType } from './basicTypes'

export interface authMutaionResponse {
	code: number
	success: boolean
	message: string
	user?: employeeType
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
	employee?: employeeType
	employees?: employeeType[]
	[index: string]: any
}

export interface leaveTypeMutaionResponse {
	code: number
	success: boolean
	message: string
	leaveType?: leaveTypeType
	leaveTypes?: leaveTypeType[]
	[index: string]: any
}

export interface leaveMutaionResponse {
	code: number
	success: boolean
	message: string
	leave?: leaveType
	leaves?: leaveType[]
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