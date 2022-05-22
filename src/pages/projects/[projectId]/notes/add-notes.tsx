import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Grid,
	GridItem,
	HStack,
	Radio,
	RadioGroup,
	Stack,
	Text,
	VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'components/form/Input'
import SelectMany from 'components/form/SelectMany'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import { createProjectNoteMutation } from 'mutations/projectNote'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { allEmployeesQuery } from 'queries/employee'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdOutlineSubtitles } from 'react-icons/md'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { IOption } from 'type/basicTypes'
import { createProjectNoteForm } from 'type/form/basicFormType'
import { projectMutaionResponse } from 'type/mutationResponses'
import { CreateProjectNoteValidate } from 'utils/validate'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IAddNoteProps {
	onCloseDrawer: () => void
}

export default function AddNote({ onCloseDrawer }: IAddNoteProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	//State ----------------------------------------------------------------------
	const [detail, setDetail] = useState<string>('')
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [noteType, setNoteType] = useState<'Public' | 'Private'>('Public')
	const [visibleToClient, setVisibleToClient] = useState<boolean>(false)
	const [askRePassword, setAskRePassword] = useState<boolean>(false)

	//query ----------------------------------------------------------------------
	// get all employees
	const { data: allEmployees } = allEmployeesQuery(isAuthenticated)

	//mutation -------------------------------------------------------------------
	const [mutateCreProjectNote, { status: statusCreProjectNote, data: dataCreProjectNote }] =
		createProjectNoteMutation(setToast)

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

	//Set data option employees state
	useEffect(() => {
		if (allEmployees && allEmployees.employees) {
			let newOptionEmployees: IOption[] = []

			allEmployees.employees.map((employee) => {
				newOptionEmployees.push({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text>{employee.email}</Text>
							</HStack>
						</>
					),
					value: employee.id,
				})
			})

			setOptionEmployees(newOptionEmployees)
		}
	}, [allEmployees])

	//Note when request success
	useEffect(() => {
		if (statusCreProjectNote === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataCreProjectNote?.message as string,
			})
		}
	}, [statusCreProjectNote])

	// setForm and submit form create new project note -------------------------------
	const formSetting = useForm<createProjectNoteForm>({
		defaultValues: {
			detail: '',
			title: '',
			employees: [],
		},
		resolver: yupResolver(CreateProjectNoteValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: createProjectNoteForm) => {
		if (!projectId) {
			setToast({
				msg: 'Not found project to add new project note',
				type: 'error',
			})
		} else {
			values.detail = detail
			values.visible_to_client = visibleToClient
			values.ask_re_password = askRePassword
			values.note_type = noteType
			values.project = Number(projectId)
			mutateCreProjectNote(values)
		}
	}

	//Funtion -------------------------------------------------------------------
	const onChangeDetail = (value: string) => {
		setDetail(value)
	}

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="title"
							label="Note Title"
							icon={
								<MdOutlineSubtitles fontSize={'20px'} color="gray" opacity={0.6} />
							}
							form={formSetting}
							placeholder="Enter Note Title"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack align={'start'}>
							<Text>Note Type</Text>
							<RadioGroup
								onChange={(value: 'Public' | 'Private') => setNoteType(value)}
								value={noteType}
							>
								<Stack direction="row">
									<Radio value="Public">Public</Radio>
									<Radio value="Private">Private</Radio>
								</Stack>
							</RadioGroup>
						</VStack>
					</GridItem>

					{noteType === 'Private' && (
						<>
							<GridItem w="100%" colSpan={[2]}>
								<SelectMany
									form={formSetting}
									label={'Select Employee'}
									name={'employees'}
									required={true}
									options={optionEmployees}
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<Checkbox
									isChecked={visibleToClient}
									onChange={() => setVisibleToClient(!visibleToClient)}
								>
									Visible To Client
								</Checkbox>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<Checkbox
									isChecked={askRePassword}
									onChange={() => setAskRePassword(!askRePassword)}
								>
									Ask to re-enter password
								</Checkbox>
							</GridItem>
						</>
					)}

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Note Detail
							</Text>
							<ReactQuill
								placeholder="Enter you text"
								modules={{
									toolbar: [
										['bold', 'italic', 'underline', 'strike'], // toggled buttons
										['blockquote', 'code-block'],

										[{ header: 1 }, { header: 2 }], // custom button values
										[{ list: 'ordered' }, { list: 'bullet' }],
										[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
										[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
										[{ direction: 'rtl' }], // text direction

										[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
										[{ header: [1, 2, 3, 4, 5, 6, false] }],

										[{ color: [] }, { background: [] }], // dropdown with defaults from theme
										[{ font: [] }],
										[{ align: [] }],

										['clean'], // remove formatting button
									],
								}}
								value={detail}
								onChange={onChangeDetail}
							/>
						</VStack>
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
				{statusCreProjectNote == 'running' && <Loading />}
			</Box>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	//Get accesstoken
	const getAccessToken: { accessToken: string; code: number; message: string; success: boolean } =
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh_token`, {
			method: 'GET',
			headers: {
				cookie: context.req.headers.cookie,
			} as HeadersInit,
		}).then((e) => e.json())

	//Redirect login page when error
	if (getAccessToken.code !== 200) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}

	//Check assigned
	const checkAsignedProject: projectMutaionResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${context.query.projectId}/check-asigned`,
		{
			method: 'GET',
			headers: {
				authorization: `Bear ${getAccessToken.accessToken}`,
			} as HeadersInit,
		}
	).then((e) => e.json())

	if (!checkAsignedProject.success) {
		return {
			notFound: true,
		}
	}

	return {
		props: {},
	}
}
