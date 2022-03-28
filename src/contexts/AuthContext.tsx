import { useToast } from '@chakra-ui/react'
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useState } from 'react'
import { TToast } from 'type/basicTypes'
import JWTManager from 'utils/jwt'

interface IAuthContext {
	isAuthenticated: boolean
	setIsAuthenticated: Dispatch<SetStateAction<boolean>>
	checkAuth: () => Promise<void>
	logoutClient: () => void
	setToast: TToast
}

const defaultIsAuthenticated = false

export const AuthContext = createContext<IAuthContext>({
	isAuthenticated: defaultIsAuthenticated,
	setIsAuthenticated: () => {},
	checkAuth: () => Promise.resolve(),
	logoutClient: () => {},
	setToast: ()=> {}
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	// use toast
	const toast = useToast()
	const setToast: TToast = ({ type, msg }) => {
		if(type) {
			toast({
				position: 'top-right',
				description: msg,
				isClosable: true,
				status: type,
				duration: 5000,
				variant: 'subtle'
			})
		}
	}

	const [isAuthenticated, setIsAuthenticated] = useState(defaultIsAuthenticated)

	const logoutClient = () => {
		JWTManager.deleteToken()
		setIsAuthenticated(false)
	}

	const checkAuth = useCallback(async () => {
		const token = JWTManager.getToken()
		if (token) setIsAuthenticated(true)
		else {
			const success = await JWTManager.getRefreshToken()
			if (success) setIsAuthenticated(true)
		}
	}, [])

	const authContextData = {
		isAuthenticated,
		checkAuth,
		setIsAuthenticated,
		logoutClient,
		setToast,
	}

	return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
