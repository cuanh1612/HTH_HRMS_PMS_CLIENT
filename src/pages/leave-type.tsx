import { Box, Divider, Grid, GridItem, VStack, Button } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'components/form/Input'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import { createLeaveTypeMutation } from 'mutations/leaveType'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineBgColors, AiOutlineCheck } from 'react-icons/ai'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import { useSWRConfig } from 'swr'
import { createLeaveTypeForm } from 'type/form/auth'
import { CreateLeaveTypeValidate } from 'utils/validate'

export interface ILeaveTypeProps {}

export default function LeaveType(props: ILeaveTypeProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { mutate } = useSWRConfig()

	//Mutation -----------------------------------------------------------
	const [mutateCreLeaveType, { status: statusCreLeaveType, data: dataCreLeaveType }] =
		createLeaveTypeMutation(setToast)

	// setForm and submit form create new leave type ---------------------
	const formSetting = useForm<createLeaveTypeForm>({
		defaultValues: {
			name: '',
			color_code: '#16813D',
		},
		resolver: yupResolver(CreateLeaveTypeValidate),
	})

	const { handleSubmit } = formSetting

	//Function -----------------------------------------------------------
	const onSubmitLeaveType = (value: createLeaveTypeForm) => {
		mutateCreLeaveType(value)
	}

	//Useeffect ----------------------------------------------------------
	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	//Useeffect ----------------------------------------------------------
	//Notice when create success
	useEffect(() => {
		switch (statusCreLeaveType) {
			case 'success':
				if (dataCreLeaveType) {
					//Notice
					setToast({
						type: 'success',
						msg: dataCreLeaveType?.message,
					})

					//Set data form
					formSetting.reset({
						name: '',
						color_code: '#16813D',
					})

                    //Refetch data all leave types
                    mutate('leave-types')
				}
				break

			default:
				break
		}
	}, [statusCreLeaveType])

	return (
		<Box>
			<VStack align={'start'}>
				<Divider />
				<Box
					as={'form'}
					w="full"
					paddingInline={6}
					onSubmit={handleSubmit(onSubmitLeaveType)}
				>
					<Grid templateColumns="repeat(2, 1fr)" gap={6}>
						<GridItem w="100%" colSpan={[2, 1]}>
							<Input
								name="name"
								label="Leave Type"
								icon={
									<MdOutlineDriveFileRenameOutline
										fontSize={'20px'}
										color="gray"
										opacity={0.6}
									/>
								}
								form={formSetting}
								placeholder="E.g. Sick, Casual"
								type="text"
								required
							/>
						</GridItem>

						<GridItem w="100%" colSpan={[2, 1]}>
							<Input
								name="color_code"
								label="Color Code"
								icon={
									<AiOutlineBgColors
										fontSize={'20px'}
										color="gray"
										opacity={0.6}
									/>
								}
								form={formSetting}
								placeholder="Select Color Code"
								type="color"
								required
							/>
						</GridItem>
					</Grid>

					<VStack align={'end'}>
						<Button
							color={'white'}
							bg={'hu-Green.normal'}
							transform="auto"
							_hover={{ bg: 'hu-Green.normalH', scale: 1.05 }}
							_active={{
								bg: 'hu-Green.normalA',
								scale: 1,
							}}
							leftIcon={<AiOutlineCheck />}
							mt={6}
							type="submit"
						>
							Save
						</Button>
					</VStack>
					{statusCreLeaveType === 'running' && <Loading />}
				</Box>
				<Divider />
			</VStack>
		</Box>
	)
}
