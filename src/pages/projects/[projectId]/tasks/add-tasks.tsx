import { Box, Button, Grid, GridItem } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'components/form/Input'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdOutlineSubtitles } from 'react-icons/md'
import { createProjectTaskForm } from 'type/form/basicFormType'
import { CreateProjectTaskValidate } from 'utils/validate'

export interface IAddTaskProps {
	onCloseDrawer?: () => void
	statusId?: string | number
}

export default function AddTask(props: IAddTaskProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	// setForm and submit form create new task discussion room -----------
	const formSetting = useForm<createProjectTaskForm>({
		defaultValues: {
			name: '',
		},
		resolver: yupResolver(CreateProjectTaskValidate),
	})

	const { handleSubmit } = formSetting

	//Function -----------------------------------------------------------
	const onSubmitTask = (value: createProjectTaskForm) => {
		console.log(value)
	}

	//User effect ---------------------------------------------------------------
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

	return (
		<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmitTask)}>
			<Grid templateColumns="repeat(2, 1fr)" gap={6}>
				<GridItem w="100%" colSpan={[2, 1]}>
					<Input
						name="name"
						label="Task Name"
						icon={<MdOutlineSubtitles fontSize={'20px'} color="gray" opacity={0.6} />}
						form={formSetting}
						placeholder="Enter Note Title"
						type="text"
						required
					/>
				</GridItem>
			</Grid>

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
			{/* {statusCreProjectNote == 'running' && <Loading />} */}
		</Box>
	)
}
