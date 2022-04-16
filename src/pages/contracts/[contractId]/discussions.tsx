export interface IDiscussionProps {}

import { Avatar, Box, Button, HStack, Image, Text, useDisclosure, VStack } from '@chakra-ui/react'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import { createDiscussionMutation } from 'mutations/discussion'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AiOutlinePlusCircle, AiOutlineSend } from 'react-icons/ai'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function Discussion(props: IDiscussionProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { contractId } = router.query

	//state ---------------------------------------------------------------------
	const [content, setContent] = useState<string>('')

	//Setup disclosure -----------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()

	//mutation -------------------------------------------------------------------
	const [mutateCreDiscussion, { status: statusCreDiscussion, data: dataCreDiscussion }] =
		createDiscussionMutation(setToast)

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
		if (statusCreDiscussion === 'success') {
			setToast({
				type: 'success',
				msg: dataCreDiscussion?.message as string,
			})

			setContent('')
		}
	}, [statusCreDiscussion])

	//function ------------------------------------------------------------------
	const onChangeContent = (value: string) => {
		setContent(value)
	}

	//Handle create discussion
	const onCreDiscussion = () => {
		if (!currentUser) {
			setToast({
				msg: 'Please login first',
				type: 'warning',
			})
		} else {
			if (!content) {
				setToast({
					msg: 'Please enter field content',
					type: 'warning',
				})
			} else {
				mutateCreDiscussion({
					content,
					...(currentUser.role === 'Client'
						? { client: currentUser.id }
						: {
								employee: currentUser.id,
						  }),
					contract: Number(contractId),
				})
			}
		}
	}

	return (
		<Box p={10} bgColor={'#f2f4f7'} height={'100vh'}>
			<VStack align={'start'} w="full" bgColor={'white'} p={5} borderRadius={5} spacing={5}>
				<Text fontSize={18} fontWeight={'semibold'}>
					Discussion
				</Text>

				<Box position={"relative"} p={2}>
					{isOpenAdd ? (
						<VStack w={'full'} spacing={5} position={'relative'}>
							<HStack w={'full'} align={'start'}>
								{currentUser && (
									<Avatar name={currentUser.name} src={currentUser.avatar?.url} />
								)}
								<ReactQuill
									style={{
										width: '100%',
									}}
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
									value={content}
									onChange={onChangeContent}
								/>
							</HStack>

							<HStack w={'full'} justify={'end'}>
								<Button onClick={onCloseAdd} variant={'ghost'}>
									Cancel
								</Button>
								<Button
									colorScheme={'teal'}
									rightIcon={<AiOutlineSend />}
									onClick={onCreDiscussion}
								>
									Submit
								</Button>
							</HStack>
						</VStack>
					) : (
						<Button
							leftIcon={<AiOutlinePlusCircle />}
							variant="ghost"
							color={'blue.400'}
							_hover={{
								color: 'black',
							}}
							onClick={onOpenAdd}
						>
							Add Comment
						</Button>
					)}

					{
						statusCreDiscussion === "running" && <Loading/>
					}
				</Box>

			</VStack>
		</Box>
	)
}
