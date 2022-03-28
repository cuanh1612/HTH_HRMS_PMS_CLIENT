export interface userType {
	email: string
	username: string
}

// toast
export type TToast = ({ type, msg }: { type: 'error' | 'success'; msg: string }) => void
