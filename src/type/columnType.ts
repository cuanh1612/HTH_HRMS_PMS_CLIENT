import { employeeType, IOption } from "./basicTypes"

export interface IOptionColumn {
	currentUser: employeeType | null
	onUpdate?: any
	onDelete?: any
	onDetail?: any
}

export interface IEmployeeColumn extends IOptionColumn {
	onChangeRole: any
	dataRoleEmployee: IOption[]
}

export interface IJobColumn extends IOptionColumn {
	onChangeStatus: any
}

export interface ICandidateColumn extends IOptionColumn {
	onChangeStatus: any
	job?: string
	location?: string
}

export interface ILeaveColumn extends IOptionColumn {
	onRejected: any
	onApproved: any
}

export interface IContractColumn extends IOptionColumn {
	onPublic: any
}

export  interface IProjectMemberColumn extends IOptionColumn {
	project_Admin?: employeeType
	setAdmin: any
	setHourlyRate: any
}

export interface IProjectTimeLogsColumn extends IOptionColumn {
	project_Admin?: employeeType
}