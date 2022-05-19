import {
	Box,
	Button,
	Grid,
	GridItem,
	Radio,
	RadioGroup,
	Stack,
	Text,
	VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'components/form/Input'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import { createNoticeBoardMutation } from 'mutations/noticeBoard'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCardHeading } from 'react-icons/bs'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { createNoticeBoardForm } from 'type/form/basicFormType'
import { createNoticeBoardValidate } from 'utils/validate'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IAddNoticeBoardProps {
	onCloseDrawer: () => void
}

export default function AddNoticeBoard({ onCloseDrawer }: IAddNoticeBoardProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ----------------------------------------------------------------------
	const [detailNotice, setDetailNotice] = useState<string>('')
	const [noticeTo, setNoticeTo] = useState<string>('Employees')

	//mutation -------------------------------------------------------------------
	const [mutateCreNoticeBoard, { status: statusCreNoticeBoard, data: dataCreNoticeBoard }] =
		createNoticeBoardMutation(setToast)

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

	//Note when request success
	useEffect(() => {
		if (statusCreNoticeBoard === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataCreNoticeBoard?.message as string,
			})
		}
	}, [statusCreNoticeBoard])

	// setForm and submit form create new notice -------------------------------
	const formSetting = useForm<createNoticeBoardForm>({
		defaultValues: {
			heading: '',
		},
		resolver: yupResolver(createNoticeBoardValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: createNoticeBoardForm) => {
		//Check value employees
		if (!detailNotice) {
			setToast({
				msg: 'Please enter field detail notive board',
				type: 'warning',
			})
		} else {
			//Create project
			values.details = detailNotice
			values.notice_to = noticeTo
			mutateCreNoticeBoard(values)
		}
	}

	//Funtion -------------------------------------------------------------------
	const onChangeDetails = (value: string) => {
		setDetailNotice(value)
	}

	//Handle change notice to radio
	const onChangeNoticeTo = (value: string) => {
		setNoticeTo(value)
	}

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2]}>
						<Text fontWeight={'normal'} color={'gray.400'} pb={2}>
							Notice To{' '}
							<Text display={'inline-block'} color={'red'}>
								*
							</Text>
						</Text>
						<RadioGroup onChange={onChangeNoticeTo} value={noticeTo}>
							<Stack direction="row">
								<Radio value="Employees">Employees</Radio>
								<Radio value="Clients">Clients</Radio>
							</Stack>
						</RadioGroup>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<Input
							name="heading"
							label="Notice Heading"
							icon={<BsCardHeading fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="e.g. New year celebrations at office"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Notice Details{' '}
								<Text display={'inline-block'} color={'red'}>
									*
								</Text>
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
								value={detailNotice}
								onChange={onChangeDetails}
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

				{statusCreNoticeBoard === 'running' && <Loading />}
			</Box>
		</>
	)
}
