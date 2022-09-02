import { Box, Button, useColorModeValue, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Head } from 'components/common'
import { Input } from 'components/form'
import { AuthLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { recoverPassMutation } from 'mutations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CgMail } from 'react-icons/cg'
import { NextLayout } from 'type/element/layout'
import { TCoverPassword } from 'type/form/basicFormType'
import { recoverPassValidate } from 'utils/validate'

const recoverPassword: NextLayout = () => {
	const { isAuthenticated, handleLoading,setToast } = useContext(AuthContext)
	const router = useRouter()

	// underline
	const underline = useColorModeValue('hu-Lam.normal', 'hu-Lam.dark')
	// login button
	const loginButton = useColorModeValue('hu-Green.normal', 'hu-Green.dark')
	const loginButtonH = useColorModeValue('hu-Green.normalH', 'hu-Green.darkH')
	const loginButtonA = useColorModeValue('hu-Green.normalA', 'hu-Green.darkA')

  // mutation recover password
  const [recover, {data: dataRecover, status: statusRecover}] = recoverPassMutation(setToast)
  
	// setForm and submit form ----------------------------------------------------------
	const formSetting = useForm<TCoverPassword>({
		defaultValues: {
			email: '',
		},
		resolver: yupResolver(recoverPassValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: TCoverPassword) => recover(values)
  
  // recover successfully
  useEffect(()=> {
    if(statusRecover == 'success' && dataRecover) {
      setToast({
        msg: dataRecover.message,
        type: statusRecover
      })
    }
  }, [statusRecover])

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

	return (
		<VStack spacing={8} minW={'380px'}>
			<Head title="Recover password" />
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
						Forgot password?
					</Box>
				</Box>
				<Box color={'gray.400'} as="span">
					We'll send you an email with instructions
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
						Recover password
					</Button>

					<Box as="div" w={'full'}>
						<Link href={'/login'} passHref>
							<Box
								color={'hu-Green.normal'}
								cursor="pointer"
								textDecoration={'underline'}
								as="a"
							>
								Go back
							</Box>
						</Link>
					</Box>
				</VStack>
			</VStack>
		</VStack>
	)
}

recoverPassword.getLayout = AuthLayout

export default recoverPassword
