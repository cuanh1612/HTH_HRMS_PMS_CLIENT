import { Box, Button, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { SelectCustom } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { updateStickyNoteMutation } from 'mutations/StickyNote'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { allStickyNoteQuery, detailStickyNoteQuery } from 'queries/stickyNote'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { updateStickyNoteForm } from 'type/form/basicFormType'
import { dataStickyNoteColor } from 'utils/basicData'
import { updateStickyNoteValidate } from 'utils/validate'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IUpdateStickyNoteProps {
	onCloseDrawer?: () => void
	stickNoteId?: string | number
}

export default function UpdateStickyNote({
	stickNoteId: stickyNoteIdProp,
    onCloseDrawer
}: IUpdateStickyNoteProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
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

	//Funtion -------------------------------------------------------------------
	const onChangeNote = (value: string) => {
		setNote(value)
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

	//Note when request success
	useEffect(() => {
		if (statusUpdateStickyNote === 'success') {
            if(onCloseDrawer){
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
        if(dataDetailStickyNote?.stickynote){
            formSetting.reset({
                color: dataDetailStickyNote.stickynote.color
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
								Note <span style={{ color: 'red' }}>*</span>
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
								value={note}
								onChange={onChangeNote}
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

				{statusUpdateStickyNote === 'running' && <Loading />}
			</Box>
		</>
	)
}
