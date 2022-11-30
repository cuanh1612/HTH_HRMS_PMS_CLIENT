import { Box, useDisclosure, useToast } from '@chakra-ui/react'
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
import { employeeType, IContractUrls, TToast } from 'type/basicTypes'
import JWTManager from 'utils/jwt'

import io, { Socket } from 'socket.io-client'
import { Loading } from 'components/common'

interface DefaultEventsMap {
	[event: string]: (...args: any[]) => void
}

interface IAuthContext {
	isAuthenticated: boolean | null
	setIsAuthenticated: Dispatch<SetStateAction<boolean | null>>
	currentUser: employeeType | null
	setCurrentUser: Dispatch<SetStateAction<employeeType | null>>
	checkAuth: () => Promise<void>
	logoutClient: () => void
	setToast: TToast
	handleLoading: (isLoading: boolean) => void
	socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
	setContractUrls: (id: string | number) => void
	contractUrls?: IContractUrls
	isOpenMenu: boolean
	onOpenMenu: () => void
	onCloseMenu: () => void
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
	socket: null,
	setContractUrls: () => {},
	isOpenMenu: false,
	onOpenMenu: () => {},
	onCloseMenu: () => {},
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	// set open menu
	const { isOpen, onOpen, onClose } = useDisclosure()
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
	const [currentUser, setCurrentUser] = useState<employeeType | null>(null)
	const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

	// set loading page
	const [loadingPage, setLoading] = useState(true)

	const handleLoading = (isLoading: boolean) => {
		setLoading(isLoading)
	}

	const ContractUrlsHandle = (id: string | number) => {
		if (id) {
			setContractUrls({
				discussion: `/contracts/${id}`,
				files: `/contracts/files/${id}`,
				summary: `/contracts/summary/${id}`,
			})
		}
	}
	const [contractUrls, setContractUrls] = useState<IContractUrls>()

	//mutation
	const { data: dataCurrentUser } = currentUserQuery(isAuthenticated)

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

	//Set data current user
	useEffect(() => {
		if (dataCurrentUser && dataCurrentUser.user) {
			setCurrentUser(dataCurrentUser.user)
		} else {
			setCurrentUser(null)
		}
	}, [dataCurrentUser])

	//Setting socket
	useEffect(() => {
		const socketIo = io(process.env.NEXT_PUBLIC_API_URL as string)
		setSocket(socketIo)
		socketIo.emit('connection')

		//Clean socket
		function cleanup() {
			socketIo.disconnect()
		}
		return cleanup
	}, [])

	//Add new user socket
	useEffect(() => {
		if (socket && currentUser) {
			socket.emit('newUser', currentUser.email)
		}
	}, [socket, currentUser])

	const authContextData: IAuthContext = {
		isAuthenticated,
		checkAuth,
		currentUser,
		setCurrentUser,
		setIsAuthenticated,
		logoutClient,
		setToast,
		handleLoading,
		socket,
		contractUrls,
		setContractUrls: ContractUrlsHandle,
		isOpenMenu: isOpen,
		onOpenMenu: onOpen,
		onCloseMenu: onClose,
	}

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
					{
						loadingPage && <Loading/>
					}
		
				</Box>
			</AuthContext.Provider>
		</>
	)
}

export default AuthContextProvider
