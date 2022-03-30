export interface userType {
	email: string
	username: string
}

export interface departmentType {
	id: number,
	name: string,
	[index: string]: any
}

export interface designationType {
	id: number,
	name: string,
	[index: string]: any
}

export interface IOption {
	value: string,
	lable: string
}

// toast
export type TToast = ({ type, msg }: { type: 'error' | 'success'; msg: string }) => void
