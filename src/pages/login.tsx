// component and hooks of library
import {
	Box,
	Button,
	ButtonGroup,
	Divider,
	HStack,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Head } from 'components/common'
import { Input } from 'components/form'
import { AuthLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { loginGoogleMutation, loginMutation } from 'mutations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
// login with google
import { useGoogleLogin } from 'react-google-login'
// validate form
import { useForm } from 'react-hook-form'
import { BiKey } from 'react-icons/bi'
import { CgMail } from 'react-icons/cg'
// icons
import { ImGoogle } from 'react-icons/im'

// layout
import { NextLayout } from 'type/element/layout'
import { loginForm } from 'type/form/basicFormType'
import JWTManager from 'utils/jwt'
import redirectPage from 'utils/redirect'
import { LoginValidate } from 'utils/validate'

const Login: NextLayout = () => {
	// set authenticated when login success, set toast
	const { setIsAuthenticated, setToast, isAuthenticated, handleLoading, currentUser } =
		useContext(AuthContext)
	const router = useRouter()

	// login ------------------------------------------------
	// loading button
	const [googleLoad, setGLoad] = useState(false)

	const { signIn } = useGoogleLogin({
		onSuccess: (res: any) => {
			mutateLoginG({
				token: res.tokenId,
			})
		},
		onFailure: () => {
			setGLoad(false)
		},
		isSignedIn: false,
		clientId: '345570644203-tleaq4dh709669ch4tmvbese58q9asbb.apps.googleusercontent.com',
	})

	const [mutate, { status, data }] = loginMutation(setToast)
	const [mutateLoginG, { status: statusLoginG, data: dataLoginG }] = loginGoogleMutation(setToast)

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

	// setForm and submit form ----------------------------------------------------------
	const formSetting = useForm<loginForm>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: yupResolver(LoginValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: loginForm) => mutate(values)

	// useEffect -----------------------------------------------------

	// alert when login successfully or failed
	useEffect(() => {
		if (status == 'success') {
			setToast({
				type: status,
				msg: data?.message as string,
			})
			JWTManager.setToken(data?.accessToken as string)
			setIsAuthenticated(true)
			if(data?.user) {
				router.push(redirectPage(data.user))
			}
		}
	}, [status])

	// set loading google button
	useEffect(() => {
		switch (statusLoginG) {
			case 'running':
				break

			case 'success': {
				setGLoad(false)
				setToast({
					type: 'success',
					msg: dataLoginG?.message as string,
				})
				JWTManager.setToken(dataLoginG?.accessToken as string)
				setIsAuthenticated(true)
				if(dataLoginG?.user) {
					router.push(redirectPage(dataLoginG.user))
				}
				break
			}

			default:
				return setGLoad(false)
		}
	}, [statusLoginG])

	// check authenticate to redirect to home page
	useEffect(() => {
		if (isAuthenticated && currentUser) {
			router.push(redirectPage(currentUser))
		} else {
			if (isAuthenticated == false) {
				handleLoading(false)
			}
		}
	}, [isAuthenticated, currentUser])

	return (
		<VStack spacing={8} w={'full'} maxW={'380px'}>
			<Head title="Login" />
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
						type={'text'}
						required={true}
						placeholder="Enter your email"
						label="Email"
						name="email"
						form={formSetting}
						icon={<CgMail fontSize={'20px'} color="gray" opacity={0.6} />}
					/>
					<Input
						type={'password'}
						required={true}
						placeholder="Enter your password"
						label="Password"
						form={formSetting}
						name={'password'}
						icon={<BiKey fontSize={'20px'} color="gray" opacity={0.6} />}
					/>
				</VStack>
				<ButtonGroup w={'full'} variant="outline" spacing="5">
					<Button w={'full'} onClick={()=> {
						formSetting.setValue('email', `${process.env.NEXT_PUBLIC_ADMIN_ACCOUNT}`)
						formSetting.setValue('password', `${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`)
					}} colorScheme="green">
						Admin
					</Button>
					<Button onClick={()=> {
						formSetting.setValue('email', `${process.env.NEXT_PUBLIC_EMPLOYEE_ACCOUNT}`)
						formSetting.setValue('password', `${process.env.NEXT_PUBLIC_EMPLOYEE_PASSWORD}`)
					}} w={'full'}>Employee</Button>
					<Button onClick={()=> {
						formSetting.setValue('email', `${process.env.NEXT_PUBLIC_CLIENT_ACCOUNT}`)
						formSetting.setValue('password', `${process.env.NEXT_PUBLIC_CLIENT_PASSWORD}`)
					}} w={'full'}>Client</Button>
				</ButtonGroup>
				<VStack w={'full'} spacing={5}>
					<Button
						isLoading={status == 'running' ? true : false}
						loadingText={'wait...'}
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
						onClick={() => {
							setGLoad(true)
							signIn()
						}}
						isLoading={googleLoad}
						loadingText={'wait...'}
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
						<Link href={'/recover-password'} passHref>
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
	)
}

// use layout
Login.getLayout = AuthLayout

export default Login
