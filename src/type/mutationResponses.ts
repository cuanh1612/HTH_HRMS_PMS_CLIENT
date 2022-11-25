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
	interviewFileType,
	interviewType,
	jobApplicationFileType,
	jobApplicationType,
	jobOfferLetterType,
	jobType,
	jobTypeType,
	leaveType,
	leaveTypeType,
	locationType,
	milestoneType,
	noticeBoardType,
	notificationType,
	projectActivityType,
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
	workExperienceType,
} from './basicTypes'

export interface commonResponse {
	code: number
	success: boolean
	message: string
	[index: string]: any
}

export interface authMutationResponse extends commonResponse {
	user?: employeeType
	accessToken?: string
}

export interface userMutationResponse extends commonResponse {
	user?: userType
	users?: userType[]
}

export interface employeeMutationResponse extends commonResponse {
	employee?: employeeType
	employees?: employeeType[]
}

export interface openTasksEmployeeMutationResponse extends commonResponse {
	countOpentasks?: number
}

export interface hoursLoggedEmployeeMutationResponse extends commonResponse {
	hoursLogged?: number
}

export interface lateAttendanceEmployeeMutationResponse extends commonResponse {
	lateAttendance?: number
}

export interface countLeavesTakenEmployeeMutationResponse extends commonResponse {
	countLeavesTaken?: number
}

export interface countTasksStatusEmployeeMutationResponse extends commonResponse {
	countTasksStatus?: number
}

export interface countProjectsEmployeeMutationResponse extends commonResponse {
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

export interface leaveTypeMutationResponse extends commonResponse {
	leaveType?: leaveTypeType
	leaveTypes?: leaveTypeType[]
}

export interface leaveMutationResponse extends commonResponse {
	leave?: leaveType
	leaves?: leaveType[]
}

export interface milestoneMutationResponse extends commonResponse {
	milestone?: milestoneType
	milestones?: milestoneType[]
}

export interface signMutationResponse extends commonResponse {
	sign?: signType
	signs?: signType[]
}

export interface DepartmentMutationResponse extends commonResponse {
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

export interface DesignationMutationResponse extends commonResponse {
	designation?: designationType
	designations?: designationType[]
}

export interface DiscussionMutationResponse extends commonResponse {
	discussion?: discussionType
	discussions?: discussionType[]
}

export interface ClientCategoryMutationResponse extends commonResponse {
	clientCategory?: clientCategoryType
	clientCategories?: clientCategoryType[]
}

export interface ClientSubCategoryMutationResponse extends commonResponse {
	clientSubCategory?: clientSubCategoryType
	clientSubCategories?: clientSubCategoryType[]
}

export interface attendanceMutationResponse {
	data: employeeType[]
}

export interface clientMutationResponse extends commonResponse {
	client?: clientType
	clients?: clientType[]
}

export interface clientProjectStatusMutationResponse extends commonResponse {
	countProjectStatus?: { project_status: string; count: string | number }[]
}

export interface clientTotalProjectsMutationResponse extends commonResponse {
	totalProjects?: number
}

export interface clientTotalEarningMutationResponse extends commonResponse {
	totalEarnings?: number
}

export interface holidayMutationResponse extends commonResponse {
	holiday?: holidayType
	holidays?: holidayType[]
}

export interface contractMutationResponse extends commonResponse {
	contract?: contractType
	contracts?: contractType[]
}

export interface contractTypeMutationResponse extends commonResponse {
	contractType?: contractTypeType
	contractTypes?: contractTypeType[]
}

export interface contractFileMutationResponse extends commonResponse {
	contractFile?: contractFileType
	contractFiles?: contractFileType[]
	[index: string]: any
}

export interface companyInfoMutationResponse extends commonResponse {
	companyInfo: companyInfoType
}

export interface eventMutationResponse extends commonResponse {
	event?: eventType
	Events?: eventType[]
}

export interface ProjectCategoryMutationResponse extends commonResponse {
	projectCategory?: projectCategoryType
	projectCategories?: projectCategoryType[]
}

export interface projectMutationResponse extends commonResponse {
	project?: projectType
	hourly_rate_projects: Hourly_rate_project[]
	projects?: projectType[]
	projectEarnings?: number
	projectHoursLogged?: number
	countstatusTasks: statusType[]
}

export interface statusMutationResponse extends commonResponse {
	status?: statusType
	statuses?: statusType[]
}

export interface projectFileMutationResponse extends commonResponse {
	projectFile?: projectFileType
	projectFiles?: projectFileType[]
}

export interface SalaryMutationResponse extends commonResponse {
	salary?: salaryType
	historySalary: employeeType
	salaries?: employeeType[]
}

export interface NoticeBoardMutationResponse extends commonResponse {
	noticeBoard?: noticeBoardType
	noticeBoards?: noticeBoardType[]
}

export interface ProjectDiscussionRoomMutationResponse extends commonResponse {
	projectDiscussionRoom?: projectDiscussionRoomType
	projectDiscussionRooms?: projectDiscussionRoomType[]
}

export interface projectDiscussionCategoryMutationResponse extends commonResponse {
	projectDiscussionCategory?: projectDiscussionCategoryType
	projectDiscussionCategories?: projectDiscussionCategoryType[]
	[index: string]: any
}

export interface projectDiscussionReplyMutationResponse extends commonResponse {
	projectDiscussionReply?: projectDiscussionReplyType
	projectDiscussionReplies?: projectDiscussionReplyType[]
}

export interface ProjectNoteMutationResponse extends commonResponse {
	projectNote?: projectNoteType
	projectNotes?: projectNoteType[]
}

export interface TaskCategoryMutationResponse extends commonResponse {
	taskCategory?: taskCategoryType
	taskCategories?: taskCategoryType[]
}

export interface TaskMutationResponse extends commonResponse {
	task?: taskType
	tasks?: taskType[]
}

export interface taskFileMutationResponse extends commonResponse {
	taskFile?: taskFileType
	taskFiles?: taskFileType[]
}

export interface TaskCommentMutationResponse extends commonResponse {
	taskComment?: taskCommentType
	taskComments?: taskCommentType[]
}

export interface TimeLogMutationResponse extends commonResponse {
	timeLog?: timeLogType
	timeLogs?: timeLogType[]
}

export interface stickyNoteMutationResponse extends commonResponse {
	stickynote?: stickyNoteType
	stickyNotes?: stickyNoteType[]
}

export interface roomMutationResponse extends commonResponse {
	room?: roomType
	rooms?: roomType[]
	other_rooms?: roomType[]
}

export interface NotificationMutationResponse extends commonResponse {
	notification?: notificationType
	notifications?: notificationType[]
}

export interface skillMutationResponse extends commonResponse {
	skill?: skillType
	skills?: skillType[]
}

export interface countContractSignedClientMutationResponse extends commonResponse {
	countStatusProjects?: number
}

export interface pendingMilestoneClientMutationResponse extends commonResponse {
	pendingMilestone?: milestoneType[]
}

export interface IPendingTasks  extends commonResponse {
	pendingTasksRaw: taskType[]
}

export interface jobMutationResponse extends commonResponse {
	job?: jobType
	jobs?: jobType[]
}

export interface locationMutationResponse extends commonResponse {
	location?: locationType
	locations?: locationType[]
}

export interface jobTypeMutationResponse extends commonResponse {
	jobType?: jobTypeType
	jobTypes?: jobTypeType[]
}

export interface workExperienceMutationResponse extends commonResponse {
	workExperience?: workExperienceType
	workExperiences?: workExperienceType[]
}

export interface jobApplicationMutationResponse extends commonResponse {
	jobApplication?: jobApplicationType
	jobApplications?: jobApplicationType[]
}

export interface interviewMutationResponse extends commonResponse {
	interview?: interviewType
	interviews?: interviewType[]
}

export interface interviewFileMutationResponse extends commonResponse {
	interviewFile?: interviewFileType
	interviewFiles?: interviewFileType[]
}

export interface jobOfferLetterMutationResponse extends commonResponse {
	jobOfferLetter?: jobOfferLetterType
	jobOfferLetters?: jobOfferLetterType[]
}

export interface jobApplicationFileMutationResponse extends commonResponse {
	jobApplicationFile?: jobApplicationFileType
	jobApplicationFiles?: jobApplicationFileType[]
}

export interface projectActivityMutationResponse extends commonResponse {
	projectActivity?: projectActivityType[]
}

export interface SendEmailContactResponse extends commonResponse {
}
