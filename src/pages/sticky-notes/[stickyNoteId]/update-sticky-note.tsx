import { Box, Button, Grid, GridItem, Text, useColorMode, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Editor, Loading } from 'components/common'
import { SelectCustom } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { updateStickyNoteMutation } from 'mutations/StickyNote'
import { useRouter } from 'next/router'
import { allStickyNoteQuery, detailStickyNoteQuery } from 'queries/stickyNote'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { updateStickyNoteForm } from 'type/form/basicFormType'
import { dataStickyNoteColor } from 'utils/basicData'
import { updateStickyNoteValidate } from 'utils/validate'

export interface IUpdateStickyNoteProps {
	onCloseDrawer?: () => void
	stickNoteId?: string | number
}

export default function UpdateStickyNote({
	stickNoteId: stickyNoteIdProp,
	onCloseDrawer,
}: IUpdateStickyNoteProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const {colorMode} = useColorMode()
	const router = useRouter()
	const { stickyNoteId: stickyNoteRouter } = router.query

	//state -------------------------------------------------------------
	const [note, setNote] = useState<string>('')

	//Query -------------------------------------------------------------
	const { data: dataDetailStickyNote } = detailStickyNoteQuery(
		isAuthenticated,
		stickyNoteIdProp || (stickyNoteRouter as string)
	)

	// get all sticky note
	const { mutate: refetchAllStickyNote } = allStickyNoteQuery(isAuthenticated)

	//mutation -----------------------------------------------------------
	const [mutateUpdateStickyNote, { status: statusUpdateStickyNote, data: dataUpdateStickyNote }] =
		updateStickyNoteMutation(setToast)

	// setForm and submit form update sticky note ------------------------
	const formSetting = useForm<updateStickyNoteForm>({
		defaultValues: {
			color: '#0000FF',
		},
		resolver: yupResolver(updateStickyNoteValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: updateStickyNoteForm) => {
		if (!note) {
			setToast({
				msg: 'Please enter field note',
				type: 'warning',
			})
		} else {
			values.note = note
			await mutateUpdateStickyNote({
				stickyNoteId: stickyNoteIdProp || (stickyNoteRouter as string),
				inputUpdate: values,
			})
		}
	}

	//Function -------------------------------------------------------------------
	const onChangeNote = (value: string) => {
		setNote(value)
	}

	//User effect ---------------------------------------------------------------
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

	//Note when request success
	useEffect(() => {
		if (statusUpdateStickyNote === 'success') {
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			refetchAllStickyNote()

			setToast({
				type: statusUpdateStickyNote,
				msg: dataUpdateStickyNote?.message as string,
			})
		}
	}, [statusUpdateStickyNote])

	useEffect(() => {
		if (dataDetailStickyNote?.stickynote) {
			formSetting.reset({
				color: dataDetailStickyNote.stickynote.color,
			})

			setNote(dataDetailStickyNote.stickynote.note)
		}
	}, [dataDetailStickyNote])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							required={true}
							form={formSetting}
							label={'Color'}
							name={'color'}
							options={dataStickyNoteColor}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Note{' '}
								<Text
									ml={1}
									display={'inline-block'}
									color={colorMode ? 'red.300' : 'red.500'}
								>
									*
								</Text>
							</Text>
							<Editor note={note} onChangeNote={onChangeNote} />
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

				{statusUpdateStickyNote === 'running' && <Loading />}
			</Box>
		</>
	)
}
