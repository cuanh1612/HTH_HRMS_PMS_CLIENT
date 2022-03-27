import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'contexts/AuthContext'
import { loginMutation } from 'mutations/auth'
import JWTManager from 'utils/jwt'

export interface ILoginProps {}

export default function Login() {
	const { setIsAuthenticated } = useContext(AuthContext)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [mutate, { status, data }] = loginMutation()

	useEffect(() => {
		switch (status) {
			case 'running':
				console.log('loading')
				break

			case 'success':
				JWTManager.setToken(data?.accessToken as string)
				setIsAuthenticated(true)
				console.log('stop loading')
				break

			default:
				console.log('stop loading')
				break
		}
	}, [status])

	const onLogin: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()

		mutate({
			email,
			password,
		})
	}

	return (
		<div>
			<form
				onSubmit={onLogin}
				style={{
					marginTop: '1rem',
				}}
			>
				<input
					name="email"
					type="text"
					placeholder="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					name="password"
					type="password"
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Login</button>
			</form>
		</div>
	)
}
