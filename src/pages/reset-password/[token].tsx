import { Box, Button, useColorModeValue, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'components/form'
import { AuthLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { resetPassMutation } from 'mutations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BiLockOpenAlt } from 'react-icons/bi'
import { NextLayout } from 'type/element/layout'
import { TResetPassword } from 'type/form/basicFormType'
import { validateResetPass } from 'utils/validate'

const resetPass: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const {token} = router.query

	// reset password
	const [resetPass, { data: dataReset, status: statusReset }] = resetPassMutation(setToast)

	// underline
	const underline = useColorModeValue('hu-Lam.normal', 'hu-Lam.dark')
	// login button
	const loginButton = useColorModeValue('hu-Green.normal', 'hu-Green.dark')
	const loginButtonH = useColorModeValue('hu-Green.normalH', 'hu-Green.darkH')
	const loginButtonA = useColorModeValue('hu-Green.normalA', 'hu-Green.darkA')

	// setForm and submit form ----------------------------------------------------------
	const formSetting = useForm<TResetPassword>({
		defaultValues: {
			password: '',
			passwordConfirm: '',
		},
		resolver: yupResolver(validateResetPass),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: TResetPassword) => {
		values.activeToken = token as string
		resetPass(values)
	}

	// check authenticate to redirect to home page
	useEffect(() => {
		if (isAuthenticated) {
			router.push('/')
		} else {
			if (isAuthenticated == false) {
				handleLoading(false)
			}
		}
	}, [isAuthenticated])

	useEffect(()=> {
		if(statusReset == 'success' && dataReset) {
			setToast({
				msg: dataReset.message,
				type: statusReset
			})
			router.push('/login')
		}
	}, [statusReset])


	return (
		<VStack spacing={8} minW={'380px'} maxW={'380px'}>
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
						Reset password
					</Box>
				</Box>
				<Box color={'gray.400'} as="span">
					Enter new password to reset password
				</Box>
			</VStack>

			<VStack as={'form'} onSubmit={handleSubmit(onSubmit)} spacing={5} w={'full'}>
				<VStack spacing={5} w={'full'}>
					<Input
						type={'password'}
						required={true}
						placeholder="Enter your email"
						label="Password"
						name="password"
						form={formSetting}
						icon={<BiLockOpenAlt fontSize={'20px'} color="gray" opacity={0.6} />}
					/>
					<Input
						type={'password'}
						required={true}
						placeholder="Enter your email"
						label="Confirm password"
						name="passwordConfirm"
						form={formSetting}
						icon={<BiLockOpenAlt fontSize={'20px'} color="gray" opacity={0.6} />}
					/>
				</VStack>
				<VStack w={'full'} spacing={5}>
					<Button
						// isLoading={status == 'running' ? true : false}
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
						Reset password
					</Button>

					<Box as="div" w={'full'}>
						<Link href={'/login'} passHref>
							<Box
								color={'hu-Green.normal'}
								cursor="pointer"
								textDecoration={'underline'}
								as="a"
							>
								Go to login
							</Box>
						</Link>
					</Box>
				</VStack>
			</VStack>
		</VStack>
	)
}

resetPass.getLayout = AuthLayout

export default resetPass
