import {
	clientCategoryType,
	clientSubCategoryType,
	clientType,
	contractFileType,
	contractType,
	contractTypeType,
	conversationReplyType,
	conversationType,
	departmentType,
	designationType,
	discussionType,
	employeeType,
	holidayType,
	leaveType,
	leaveTypeType,
	signType,
	userType,
} from './basicTypes'

export interface commonResponse {
	code: number
	success: boolean
	message: string
	[index: string]: any
}

export interface authMutaionResponse extends commonResponse {
	user?: employeeType
	accessToken?: string
}

export interface userMutaionResponse extends commonResponse {
	user?: userType
	users?: userType[]
}

export interface employeeMutaionResponse extends commonResponse {
	employee?: employeeType
	employees?: employeeType[]
}

export interface leaveTypeMutaionResponse extends commonResponse {
	leaveType?: leaveTypeType
	leaveTypes?: leaveTypeType[]
}

export interface leaveMutaionResponse extends commonResponse {
	leave?: leaveType
	leaves?: leaveType[]
}

export interface signMutationResponse extends commonResponse {
	sign?: signType
	signs?: signType[]
}

export interface DepartmentMutaionResponse extends commonResponse {
	department?: departmentType
	departments?: departmentType[]
}

export interface ConversationMutationResponse extends commonResponse {
	conversation?: conversationType
	conversations?: conversationType[]
}

export interface ConversationReplyMutationResponse extends commonResponse {
	reply?: conversationReplyType
	replies: conversationReplyType[]
}

export interface DesignationMutaionResponse extends commonResponse {
	designation?: designationType
	designations?: designationType[]
}

export interface DiscussionMutationResponse extends commonResponse {
	discussion?: discussionType
	discussions?: discussionType[]
}

export interface ClientCategoryMutaionResponse extends commonResponse {
	clientCategory?: clientCategoryType
	clientCategories?: clientCategoryType[]
}

export interface ClientSubCategoryMutaionResponse extends commonResponse {
	clientSubCategory?: clientSubCategoryType
	clientSubCategories?: clientSubCategoryType[]
}

export interface attendanceMutaionResponse {
	data: employeeType[]
}

export interface clientMutaionResponse extends commonResponse {
	client?: clientType
	clients?: clientType[]
}

export interface holidayMutaionResponse extends commonResponse {
	holiday?: holidayType
	holidays?: holidayType[]
}

export interface contractMutaionResponse extends commonResponse {
	contract?: contractType
	contracts?: contractType[]
}

export interface contractTypeMutaionResponse extends commonResponse {
	contractType?: contractTypeType
	contractTypes?: contractTypeType[]
}

export interface contractFileMutaionResponse extends commonResponse {
	contractFile?: contractFileType
	contractFiles?: contractFileType[]
}
