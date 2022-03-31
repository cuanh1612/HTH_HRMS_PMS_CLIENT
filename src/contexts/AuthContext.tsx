import { Box, Center, useToast } from '@chakra-ui/react'
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

// custom loading
import ClipLoader from 'react-spinners/BarLoader'
import { css } from '@emotion/react'

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`

interface IAuthContext {
	isAuthenticated: boolean | null
	setIsAuthenticated: Dispatch<SetStateAction<boolean | null>>
	currentUser: userType | null
	setCurrentUser: Dispatch<SetStateAction<userType | null>>
	checkAuth: () => Promise<void>
	logoutClient: () => void
	setToast: TToast
	handleLoading: (isLoading: boolean) => void
}

const defaultIsAuthenticated = null

export const AuthContext = createContext<IAuthContext>({
	isAuthenticated: defaultIsAuthenticated,
	setIsAuthenticated: () => {},
	currentUser: null,
	setCurrentUser: () => {},
	checkAuth: () => Promise.resolve(),
	logoutClient: () => {},
	setToast: () => {},
	handleLoading: () => {},
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
				containerStyle: {
					zIndex: 101,
				},
			})
		}
	}

	//State
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(defaultIsAuthenticated)
	const [currentUser, setCurrentUser] = useState<userType | null>(null)

	// set loading page
	const [loadingPage, setLoading] = useState(true)

	const handleLoading = (isLoading: boolean) => {
		setLoading(isLoading)
	}

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
				setIsAuthenticated(true)
			} else {
				setCurrentUser(null)
				setIsAuthenticated(false)
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
		handleLoading,
	}

	//Set data current user
	useEffect(() => {
		if (dataCurrentUser && dataCurrentUser.user) {
			setCurrentUser(dataCurrentUser.user)
		} else {
			setCurrentUser(null)
		}
	}, [dataCurrentUser])

	return (
		<>
			<AuthContext.Provider value={authContextData}>
				<Box
					pos={'relative'}
					w={'full'}
					h={loadingPage ? '100vh' : 'auto'}
					overflow={loadingPage ? 'hidden' : 'auto'}
				>
					{children}
					{loadingPage && (
						<Center
							zIndex={'100'}
							w={'full'}
							top="0"
							h="full"
							left={'0'}
							bg="#FFFFFF"
							pos="absolute"
						>
							<ClipLoader
								color={'green'}
								loading={true}
								css={override}
								width="200px"
							/>
						</Center>
					)}
				</Box>
			</AuthContext.Provider>
		</>
	)
}

export default AuthContextProvider
