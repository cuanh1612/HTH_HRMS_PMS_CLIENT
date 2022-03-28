import { FormEventHandler, useEffect, useState } from 'react'
import { registerMutation } from 'mutations/auth'

export interface IRegisterProps {}

export default function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [username, setusername] = useState('')

	const [mutate, { status }] = registerMutation()
	useEffect(() => {
		switch (status) {
			case 'running':
				console.log('loading')
				break
			default:
				console.log('stop loading')
		}
	}, [status])

	const handleRegiser: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault()
		mutate({
			email,
			username,
			password,
		})
	}

	return (
		<div>
			<form
				style={{
					marginTop: '1rem',
				}}
				onSubmit={handleRegiser}
			>
				<input
					name="username"
					type="text"
					placeholder="username"
					value={username}
					onChange={(e) => setusername(e.target.value)}
				/>
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
