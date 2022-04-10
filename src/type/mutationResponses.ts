import { clientCategoryType, clientSubCategoryType, clientType, contractType, contractTypeType, departmentType, designationType, employeeType, holidayType, leaveType, leaveTypeType, userType } from './basicTypes'

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

export interface ClientCategoryMutaionResponse {
	code: number
	success: boolean
	message: string
	clientCategory?: clientCategoryType
	clientCategories?: clientCategoryType[]
	[index: string]: any
}

export interface ClientSubCategoryMutaionResponse {
	code: number
	success: boolean
	message: string
	clientSubCategory?: clientSubCategoryType
	clientSubCategories?: clientSubCategoryType[]
	[index: string]: any
}

export interface clientMutaionResponse {
	code: number
	success: boolean
	message: string
	client?: clientType
	clients?: clientType[]
	[index: string]: any
}

export interface holidayMutaionResponse {
	code: number
	success: boolean
	message: string
	holiday?: holidayType
	holidays?: holidayType[]
	[index: string]: any
}

export interface contractMutaionResponse {
	code: number
	success: boolean
	message: string
	contract?: contractType
	contracts?: contractType[]
	[index: string]: any
}

export interface contractTypeMutaionResponse {
	code: number
	success: boolean
	message: string
	contractType?: contractTypeType
	contractTypes?: contractTypeType[]
	[index: string]: any
}