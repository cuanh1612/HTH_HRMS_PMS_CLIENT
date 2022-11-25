import {
	Box,
	Button,
	Grid,
	GridItem,
	Stack,
	Text,
	useColorMode,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Developer, Project } from 'components/common'
import { Input, Textarea } from 'components/form'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { SendMailContactMutation } from 'mutations/contact'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CgMail } from 'react-icons/cg'
import { MdSubject } from 'react-icons/md'
import { SendMailValidate } from 'utils/validate'

interface SendMail {
	email: string
	subject: string
	content: string
}

const about = () => {
	const { colorMode } = useColorMode()
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const [mutate, { status, data }] = SendMailContactMutation(setToast)

	// send button
	const sendBtn = useColorModeValue('hu-Green.normal', 'hu-Green.dark')
	const sendBtnH = useColorModeValue('hu-Green.normalH', 'hu-Green.darkH')
	const sendBtnA = useColorModeValue('hu-Green.normalA', 'hu-Green.darkA')

	const formSetting = useForm<SendMail>({
		resolver: yupResolver(SendMailValidate),
	})

	const { handleSubmit } = formSetting

	//Handle send email
	const onSubmit = async (values: SendMail) => {
		await mutate(values)
	}

	//Handle check logged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	useEffect(() => {
		if (status === 'success') {
			setToast({
				type: status,
				msg: data?.message || '',
			})

			//Reset data form
			formSetting.reset({
				email: '',
				content: '',
				subject: '',
			})
		}
	}, [status])

	return (
		<Stack flexDir={['column', null, null, null, 'row']} w={'full'} h="calc(100vh - 130px)">
			<Box
				flex={1}
				pr={['0px', null, null, null, '40px']}
				pb={['40px', null, null, null, '0px']}
			>
				<VStack
					w={'full'}
					h={'100%'}
					spacing={10}
					justifyContent={'flex-start'}
					alignItems={'flex-start'}
				>
					<VStack spacing={3}>
						<Text
							w={'full'}
							display={['block', null, null, null, 'none']}
							fontSize={['2xl', null, null, '5xl']}
							fontWeight={'semibold'}
						>
							Developers & Projects &#127881;
						</Text>

						<VStack
							display={['none', null, null, null, 'block']}
							spacing={'-10px'}
							w={'full'}
							justifyContent={'flex-start'}
							alignItems={'flex-start'}
						>
							<Text fontSize={'5xl'} fontWeight={'semibold'}>
								Developers &
							</Text>
							<Text fontSize={'5xl'} fontWeight={'semibold'}>
								Projects &#127881;
							</Text>
						</VStack>

						<Text fontSize={['md', null, null, 'xl']}>
							chung toi la lap trinh vien phat trien len he thong website nay, giup
							cac doanh nghiep quanr ly nguwoi dung vafnhan vien de dang vaf nhanh
							chong bao gom cac tinh nanh pho bien vaf hay hop. neu co chuyen gi quan
							trong thi hay lien he chung toi:
						</Text>
					</VStack>

					<VStack w={'full'} spacing={5} as={'form'} onSubmit={handleSubmit(onSubmit)}>
						<Input
							type={'text'}
							required
							placeholder="Enter your email"
							label="Email"
							name="email"
							form={formSetting}
							icon={<CgMail fontSize={'20px'} color="gray" opacity={0.6} />}
						/>
						<Input
							type={'text'}
							required
							placeholder="Enter your subject"
							label="Subject"
							name="subject"
							form={formSetting}
							icon={<MdSubject fontSize={'20px'} color="gray" opacity={0.6} />}
						/>
						<Textarea
							required
							form={formSetting}
							name="content"
							label="Content"
							placeholder="Enter your content"
						/>
						<Box w={'full'}>
							<Button
								mt={'15px !important'}
								// isLoading={status == 'running' ? true : false}
								isLoading={false}
								loadingText={'wait...'}
								type="submit"
								transform={'auto'}
								_hover={{
									background: sendBtnH,
									scale: 1.05,
								}}
								_active={{
									background: sendBtnA,
									scale: 1,
								}}
								background={sendBtn}
								color="white"
								w={'full'}
							>
								Send
							</Button>
						</Box>
					</VStack>
				</VStack>
			</Box>
			<Box flex={2}>
				<Grid
					overflow={'hidden'}
					border={colorMode == 'light' ? '1px solid' : undefined}
					borderColor={colorMode == 'light' ? 'gray.200' : undefined}
					bg={colorMode == 'light' ? 'gray.200' : undefined}
					h={'100%'}
					gridGap={'1px'}
					templateColumns={['repeat(1, 1fr)', null, 'repeat(2, 1fr)']}
					templateRows={'repeat(2, 1fr)'}
				>
					<GridItem
						role={'group'}
						cursor={'pointer'}
						colSpan={1}
						rowSpan={1}
						pos={'relative'}
						overflow={'hidden'}
					>
						<Developer
							uri="/assets/developers/hoang.jpg"
							name="Nguyen Quang Hoang"
							title="Developer 1"
							description="chung toi la lap trinh vien phat trien len he thong website nay, giup
							cac doanh nghiep quanr ly nguwoi dung vafnhan vien de dang vaf nhanh
							chong bao gom cac tinh nanh pho bien vaf hay hop. neu co chuyen gi quan
							trong thi hay lien he chung toi:"
							email="hoangdev161201@gmail.com"
							linkBio="https://bio.link/hoangngucp"
							color="#D5ECC2"
						/>
					</GridItem>
					<GridItem
						role={'group'}
						cursor={'pointer'}
						colSpan={1}
						rowSpan={1}
						pos={'relative'}
						overflow={'hidden'}
					>
						<Developer
							uri="/assets/developers/huy.jpg"
							name="Nguyen Quang Huy"
							title="Developer 2"
							description="huy an cut"
							email="huydev1612@gmail.com"
							linkBio="http://youtube.com"
							color="#FFAAA7"
						/>
					</GridItem>
					<GridItem
						role={'group'}
						cursor={'pointer'}
						colSpan={1}
						rowSpan={1}
						pos={'relative'}
						overflow={'hidden'}
					>
						<Developer
							uri="/assets/developers/trong.jpg"
							name="Nguyen Tien Trong"
							title="Developer 3"
							description="huy an cut"
							email="huydev1612@gmail.com"
							linkBio="http://youtube.com"
							color="#98DDCA"
						/>
					</GridItem>
					<GridItem
						overflow={'auto'}
						bg={colorMode == 'light' ? 'white' : '#1e2636'}
						p={'20px'}
						colSpan={1}
						rowSpan={1}
					>
						<VStack w={'full'} spacing={4}>
							<Text w={'full'}>Below are the active projects we have developed:</Text>
							<VStack alignItems={'flex-start'} spacing={4} w={'full'}>
								<Project
									title={'Enterprise web'}
									url={'https://enterpriseweb.vercel.app/'}
								/>
								<Project
									title={'ATN shop'}
									url={'https://atnshop2.herokuapp.com'}
								/>
								<Project
									title={'Tools'}
									url={'https://clienttool.herokuapp.com/post'}
								/>
								<Project
									title={'Chat realtime by firebase'}
									url={'https://lucid-elion-100800.netlify.app'}
								/>
								<Project
									title={'Manage training activities'}
									url={'https://github.com/HoangNguyen161201/CMS'}
								/>
							</VStack>
						</VStack>
					</GridItem>
				</Grid>
			</Box>
		</Stack>
	)
}

about.getLayout = ClientLayout
export default about
