import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'contexts/AuthContext'
import { loginMutation } from 'mutations/auth'
import JWTManager from 'utils/jwt'

// layout
import { NextLayout } from 'type/element/layout'
import { AuthLayout } from 'components/layouts'

// icons
import { ImGoogle } from 'react-icons/im'
import { CgMail } from 'react-icons/cg'
import { BiKey } from 'react-icons/bi'

// component and hooks of library
import { Box, Button, Divider, HStack, VStack, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'

// validate form
import { useForm } from 'react-hook-form'
import { loginForm } from 'type/form/auth'
import { LoginValidate } from 'utils/validate'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'components/form/Input'

const Login: NextLayout = () => {
	const { setIsAuthenticated } = useContext(AuthContext)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [mutate, { status, data }] = loginMutation()

	// set color when use darkMode ------------------------------------------
	// login button
	const loginButton = useColorModeValue('hu-Green.normal', 'hu-Green.dark')
	const loginButtonH = useColorModeValue('hu-Green.normalH', 'hu-Green.darkH')
	const loginButtonA = useColorModeValue('hu-Green.normalA', 'hu-Green.darkA')

	// google button
	const GButton = useColorModeValue('hu-Lam.normal', 'hu-Lam.dark')
	const GButtonH = useColorModeValue('hu-Lam.normalH', 'hu-Lam.darkH')
	const GButtonA = useColorModeValue('hu-Lam.normalH', 'hu-Lam.darkA')

	// underline
	const underline = useColorModeValue('hu-Lam.normal', 'hu-Lam.dark')

	// background of text 'or'
	const orText = useColorModeValue('white', '#1a202c')

	// setForm ----------------------------------------------------------
	const formSetting = useForm<loginForm>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: yupResolver(LoginValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (value: loginForm) => {
		console.log(value)
	}

	// useEffect -----------------------------------------------------
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
		<VStack spacing={8} minW={'380px'}>
			<VStack w={'full'} spacing={3} alignItems={'start'}>
				<Box pos={'relative'} as="div">
					<Box
						bottom={0}
						pos={'absolute'}
						width={'60%'}
						height={'5'}
						background={underline}
					></Box>
					<Box
						as="span"
						fontFamily={'"Montserrat", sans-serif'}
						fontWeight={'bold'}
						fontSize={'3xl'}
						pos={'relative'}
					>
						Great to see you again!
					</Box>
				</Box>
				<Box color={'gray.400'} as="span">
					Enter your account below
				</Box>
			</VStack>

			<VStack as={'form'} onSubmit={handleSubmit(onSubmit)} spacing={5} w={'full'}>
				<VStack spacing={5} w={'full'}>
					<Input
						required={true}
						placeholder="Enter your email"
						label="Email"
						name="email"
						form={formSetting}
						icon={<CgMail fontSize={'20px'} color="gray" opacity={0.6} />}
					/>
					<Input
						required={true}
						placeholder="Enter your password"
						label="Password"
						form={formSetting}
						name={'password'}
						icon={<BiKey fontSize={'20px'} color="gray" opacity={0.6} />}
					/>
				</VStack>
				<VStack w={'full'} spacing={5}>
					<Button
						type="submit"
						transform={'auto'}
						_hover={{
							background: loginButtonH,
							scale: 1.05,
						}}
						_active={{
							background: loginButtonA,
							scale: 1,
						}}
						background={loginButton}
						color="white"
						w={'full'}
					>
						Login
					</Button>
					<HStack justify={'center'} w={'full'} as="div" pos="relative">
						<Divider pos={'absolute'} top={'50%'} borderColor="gray.300" />
						<Box
							as="p"
							pos={'relative'}
							textAlign={'center'}
							fontWeight={'semibold'}
							color="gray.400"
							background={orText}
						>
							Or
						</Box>
					</HStack>
					<Button
						leftIcon={<ImGoogle />}
						transform={'auto'}
						_hover={{
							background: GButtonH,
							scale: 1.05,
						}}
						_active={{
							background: GButtonA,
							scale: 1,
						}}
						background={GButton}
						w={'full'}
					>
						Login with Google
					</Button>
					<Box as="div" w={'full'}>
						<Link href={'/'} passHref>
							<Box
								color={'hu-Green.normal'}
								cursor="pointer"
								textDecoration={'underline'}
								as="a"
							>
								Forgot password ?
							</Box>
						</Link>
					</Box>
				</VStack>
			</VStack>
		</VStack>
		// <div>
		// 	<form
		// 		onSubmit={onLogin}
		// 		style={{
		// 			marginTop: '1rem',
		// 		}}
		// 	>
		// 		<input
		// 			name="email"
		// 			type="text"
		// 			placeholder="email"
		// 			value={email}
		// 			onChange={(e) => setEmail(e.target.value)}
		// 		/>
		// 		<input
		// 			name="password"
		// 			type="password"
		// 			placeholder="password"
		// 			value={password}
		// 			onChange={(e) => setPassword(e.target.value)}
		// 		/>
		// 		<button type="submit">Login</button>
		// 	</form>
		// </div>
	)
}

// use layout
Login.getLayout = AuthLayout

export default Login
