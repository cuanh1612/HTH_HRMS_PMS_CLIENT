import { useToast } from '@chakra-ui/react'
import { currentUserQuery } from 'queries/auth'
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react'
import { TToast, userType } from 'type/basicTypes'
import JWTManager from 'utils/jwt'

interface IAuthContext {
	isAuthenticated: boolean
	setIsAuthenticated: Dispatch<SetStateAction<boolean>>
	currentUser: userType | null
	setCurrentUser: Dispatch<SetStateAction<userType | null>>
	checkAuth: () => Promise<void>
	logoutClient: () => void
	setToast: TToast
}

const defaultIsAuthenticated = false

export const AuthContext = createContext<IAuthContext>({
	isAuthenticated: defaultIsAuthenticated,
	setIsAuthenticated: () => {},
	currentUser: null,
	setCurrentUser: () => {},
	checkAuth: () => Promise.resolve(),
	logoutClient: () => {},
	setToast: () => {},
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	// use toast
	const toast = useToast()
	const setToast: TToast = ({ type, msg }) => {
		if (type) {
			toast({
				position: 'top-right',
				description: msg,
				isClosable: true,
				status: type,
				duration: 5000,
				variant: 'subtle',
			})
		}
	}

	//State
	const [isAuthenticated, setIsAuthenticated] = useState(defaultIsAuthenticated)
	const [currentUser, setCurrentUser] = useState<userType | null>(null)

	//mutation
	const { data: dataCurrentUser } = currentUserQuery(isAuthenticated)

	//Funtion handle
	const logoutClient = () => {
		JWTManager.deleteToken()
		setIsAuthenticated(false)
		setCurrentUser(null)
	}

	const checkAuth = useCallback(async () => {
		const token = JWTManager.getToken()
		if (token) setIsAuthenticated(true)
		else {
			const success = await JWTManager.getRefreshToken()
			if (success) {
				setIsAuthenticated(true)
			} else {
				setCurrentUser(null)
			}
		}
	}, [])

	//Use effect
	useEffect(() => {
		checkAuth()
	}, [])

	const authContextData = {
		isAuthenticated,
		checkAuth,
		currentUser,
		setCurrentUser,
		setIsAuthenticated,
		logoutClient,
		setToast,
	}

	//Set data current user
	useEffect(() => {
		if (dataCurrentUser && dataCurrentUser.user) {
			setCurrentUser(dataCurrentUser.user)
		} else {
			setCurrentUser(null)
		}
	}, [dataCurrentUser])

	return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
