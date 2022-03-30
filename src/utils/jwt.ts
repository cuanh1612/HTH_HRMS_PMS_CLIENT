import axios from 'axios'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { getData } from './fetchData'

const JWTManager = () => {
	axios.defaults.withCredentials = true
	let inMemoryToken: string | null = null
	let refreshTokenTimeoutId: number | null = null
	let userId: number | null = null
	const LOGOUT_EVENT_NAME = 'logout_event_name'

	const getToken = () => inMemoryToken

	const getUserId = () => userId

	const setToken = (accessToken: string) => {
		inMemoryToken = accessToken

		//Decode and set countdown to refresh
		const decoded = jwtDecode<JwtPayload & { userId: number; role: string; email: string }>(
			accessToken
		)
		userId = decoded.userId
		setRefreshTokenTimeout((decoded.exp as number) - (decoded.iat as number))
		return true
	}

	const abortRefreshToken = () => {
		if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId)
	}

	const deleteToken = () => {
		inMemoryToken = null
		abortRefreshToken()
		window.localStorage.setItem(LOGOUT_EVENT_NAME, Date.now().toString())
		return true
	}

	;() => {
		window.addEventListener('storage', (event) => {
			if (event.key === LOGOUT_EVENT_NAME) inMemoryToken = null
		})
	}

	const getRefreshToken = async () => {
		try {
			const response = await getData<{
				accessToken: string
			}>({
				url: 'http://localhost:4000/api/auth/refresh_token',
			})

			setToken(response.accessToken)
			return true
		} catch (error) {
			deleteToken()
			return false
		}
	}

	const setRefreshTokenTimeout = (delay: number) => {
		//5s before token expires
		refreshTokenTimeoutId = window.setTimeout(getRefreshToken, delay * 1000 - 5000)
	}

	return {
		getToken,
		setToken,
		getRefreshToken,
		deleteToken,
		getUserId,
	}
}

export default JWTManager()
