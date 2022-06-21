import {
	clientCategoryType,
	clientSubCategoryType,
	clientType,
	companyInfoType,
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
	notificationType,
	projectCategoryType,
	projectDiscussionCategoryType,
	projectDiscussionReplyType,
	projectDiscussionRoomType,
	projectFileType,
	projectNoteType,
	projectType,
	roomType,
	salaryType,
	signType,
	skillType,
	statusType,
	stickyNoteType,
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

export interface openTasksEmployeeMutaionResponse extends commonResponse {
	countOpentasks?: number
}

export interface hoursLoggedEmployeeMutaionResponse extends commonResponse {
	hoursLogged?: number
}

export interface lateAttendanceEmployeeMutaionResponse extends commonResponse {
	lateAttendance?: number
}

export interface countLeavesTakenEmployeeMutaionResponse extends commonResponse {
	countLeavesTaken?: number
}

export interface countTasksStatusEmployeeMutaionResponse extends commonResponse {
	countTasksStatus?: number
}

export interface countProjectsEmployeeMutaionResponse extends commonResponse {
	countProjects?: { title: string; count: string | number; color: string }[]
}

export interface countPendingTasksMutationResponse extends commonResponse {
	countPendingTasks?: number
}

export interface countPCompleteTasksMutationResponse extends commonResponse {
	countCompleteTasks?: number
}

export interface countStatusProjectsMutationResponse extends commonResponse {
	countStatusProjects?: { project_status: string; count: string }[]
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

export interface clientProjectStatusMutaionResponse extends commonResponse {
	countProjectStatus?: { project_status: string; count: string | number }[]
}

export interface clientTotalProjectsMutaionResponse extends commonResponse {
	totalProjects?: number
}

export interface clientTotalEarningMutaionResponse extends commonResponse {
	totalEarnings?: number
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

export interface companyInfoMutationResponse extends commonResponse {
	companyInfo: companyInfoType
}

export interface eventMutaionResponse extends commonResponse {
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
	projectEarnings?: number
	projectHoursLogged?: number
	countstatusTasks: statusType[]
}

export interface statusMutaionResponse extends commonResponse {
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
	noticeBoards?: noticeBoardType[]
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

export interface stickyNoteMutaionResponse extends commonResponse {
	stickyNote?: stickyNoteType
	stickyNotes?: stickyNoteType[]
}

export interface roomMutaionResponse extends commonResponse {
	room?: roomType
	rooms?: roomType[]
	another_rooms?: roomType[]
}

export interface NotificationMutaionResponse extends commonResponse {
	notification?: notificationType
	notifications?: notificationType[]
}

<<<<<<< HEAD
export interface skillMutationResponse extends commonResponse {
	skill?: skillType
	skills?: skillType[]
}

export interface countContractSignedClientMutaionResponse extends commonResponse {
	countStatusProjects?: number
}

export interface pendingMilestoneClientMutaionResponse extends commonResponse {
	pendingMilestone?: milestoneType[]
=======
export interface IpendingTasks  extends commonResponse {
	pendingTasksRaw: taskType[]
>>>>>>> b3b6d4015556a10c687439a69c698f632aa2588e
}