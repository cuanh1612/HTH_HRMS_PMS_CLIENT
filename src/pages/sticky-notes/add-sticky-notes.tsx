import { Box, Button, Grid, GridItem, Text, useColorMode, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Editor, Loading } from 'components/common'
import { SelectCustom } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { createStickyNoteMutation } from 'mutations/StickyNote'
import { useRouter } from 'next/router'
import { allStickyNoteQuery } from 'queries/stickyNote'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { createStickyNoteForm } from 'type/form/basicFormType'
import { dataStickyNoteColor } from 'utils/basicData'
import { createStickyNoteValidate } from 'utils/validate'

export interface IAddStickyNotesProps {
	onCloseDrawer: () => void
}

export default function AddStickyNotes({ onCloseDrawer }: IAddStickyNotesProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const {colorMode} = useColorMode()
	const router = useRouter()

	//State ----------------------------------------------------------------------
	const [note, setNote] = useState<string>('')

	//query ----------------------------------------------------------------------
	// get all sticky note
	const { mutate: refetchAllStickyNote } = allStickyNoteQuery(isAuthenticated)

	//mutation -------------------------------------------------------------------
	const [mutateCreStickyNote, { status: statusCreStickyNote, data: dataCreStickyNote }] =
		createStickyNoteMutation(setToast)

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
		if (statusCreStickyNote === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			refetchAllStickyNote()

			setToast({
				type: statusCreStickyNote,
				msg: dataCreStickyNote?.message as string,
			})
		}
	}, [statusCreStickyNote])

	// setForm and submit form create new sticky note -------------------------------
	const formSetting = useForm<createStickyNoteForm>({
		defaultValues: {
			color: '#0000FF',
		},
		resolver: yupResolver(createStickyNoteValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: createStickyNoteForm) => {
		if (!note) {
			setToast({
				msg: 'Please enter field note',
				type: 'warning',
			})
		} else {
			values.note = note
			await mutateCreStickyNote(values)
		}
	}

	//Function -------------------------------------------------------------------
	const onChangeNote = (value: string) => {
		setNote(value)
	}
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

				{statusCreStickyNote === 'running' && <Loading />}
			</Box>
		</>
	)
}
