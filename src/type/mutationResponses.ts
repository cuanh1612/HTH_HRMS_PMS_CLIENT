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
	eventType,
	holidayType,
	Hourly_rate_project,
	leaveType,
	leaveTypeType,
	milestoneType,
	noticeBoardType,
	projectCategoryType,
	projectDiscussionCategoryType,
	projectDiscussionReplyType,
	projectDiscussionRoomType,
	projectFileType,
	projectNoteType,
	projectType,
	salaryType,
	signType,
	statusType,
	taskCategoryType,
	taskCommentType,
	taskFileType,
	taskType,
	timeLogType,
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

export interface milestoneMutaionResponse extends commonResponse {
	milestone?: milestoneType
	milestones?: milestoneType[]
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
	[index: string]: any
}

export interface eventMutaionResponse  extends commonResponse {
	event?: eventType
	Events?: eventType[]
}

export interface ProjectCategoryMutaionResponse extends commonResponse {
	projectCategory?: projectCategoryType
	projectCategories?: projectCategoryType[]
}

export interface projectMutaionResponse extends commonResponse {
	project?: projectType
	hourly_rate_projects: Hourly_rate_project[]
	projects?: projectType[]
}

export interface statusMutaionResponse extends commonResponse  {
	status?: statusType
	statuses?: statusType[]
}

export interface projectFileMutaionResponse extends commonResponse {
	projectFile?: projectFileType
	projectFiles?: projectFileType[]
}

export interface SalaryMutaionResponse extends commonResponse {
	salary?: salaryType
	historySalary: employeeType
	salaries?: employeeType[]
}

export interface NoticeBoardMutaionResponse extends commonResponse {
	noticeBoard?: noticeBoardType
	noticeBoards?: noticeBoardType
}

export interface ProjectDisucssionRoomMutaionResponse extends commonResponse {
	projectDiscussionRoom?: projectDiscussionRoomType
	projectDiscussionRooms?: projectDiscussionRoomType[]
}

export interface projectDisucssionCategoryMutaionResponse extends commonResponse {
	projectDiscussionCategory?: projectDiscussionCategoryType
	projectDiscussionCategories?: projectDiscussionCategoryType[]
	[index: string]: any
}

export interface projectdiscussionReplyMutaionResponse extends commonResponse {
	projectDiscussionReply?: projectDiscussionReplyType
	projectDiscussionReplies?: projectDiscussionReplyType[]
}

export interface ProjectNoteMutaionResponse extends commonResponse {
	projectNote?: projectNoteType
	projectNotes?: projectNoteType[]
}

export interface TaskCategoryMutaionResponse extends commonResponse {
	taskCategory?: taskCategoryType
	taskCategories?: taskCategoryType[]
}

export interface TaskMutaionResponse extends commonResponse {
	task?: taskType
	tasks?: taskType[]
}

export interface taskFileMutaionResponse extends commonResponse {
	taskFile?: taskFileType
	taskFiles?: taskFileType[]
}

export interface TaskCommentMutationResponse extends commonResponse {
	taskComment?: taskCommentType
	taskComments?: taskCommentType[]
}

export interface TimeLogMutaionResponse extends commonResponse {
	timeLog?: timeLogType
	timeLogs?: timeLogType[]
}