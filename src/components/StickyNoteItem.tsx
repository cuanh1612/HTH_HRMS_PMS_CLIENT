import { Box, HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { deleteStickyNoteMutation } from 'mutations/StickyNote'
import { allStickyNoteQuery } from 'queries/stickyNote'
import { useContext, useEffect } from 'react'
import { AiOutlineEdit, AiOutlineEye } from 'react-icons/ai'
import { BsThreeDots, BsTrash } from 'react-icons/bs'
import { stickyNoteType } from 'type/basicTypes'

export interface IStickyNoteItemProps {
	stickyNote: stickyNoteType
	onDelete?: (stickyNoteId: string | number) => void
	onView?: (stickyNoteId: string | number) => void
	onEdit?: (stickyNoteId: string | number) => void
}

export default function StickyNoteItem({ stickyNote, onView, onEdit }: IStickyNoteItemProps) {
	const { setToast, isAuthenticated } = useContext(AuthContext)

	//Mutation ----------------------------------------------------------------
	const [mutateDelStickyNote, { status: statusDelStickyNote, data: dataDelStickyNote }] =
		deleteStickyNoteMutation(setToast)

	//query ----------------------------------------------------------------------
	// get all sticky note
	const { mutate: refetchAllStickyNote } = allStickyNoteQuery(isAuthenticated)

	//useeffect ---------------------------------------------------------------
	//Note when request success
	useEffect(() => {
		if (statusDelStickyNote === 'success') {
			setToast({
				type: 'success',
				msg: dataDelStickyNote?.message as string,
			})

			refetchAllStickyNote()
		}
	}, [statusDelStickyNote])

	return (
		<>
			<HStack width={'full'} align={'start'} justify={'space-between'}>
				<Box overflow={'hidden'} height={200} minHeight={200}>
					<div
						dangerouslySetInnerHTML={{
							__html: stickyNote.note ? stickyNote.note : '',
						}}
					/>
				</Box>

				<Menu placement="bottom-start">
					<MenuButton>
						<BsThreeDots />
					</MenuButton>
					<MenuList>
						<MenuItem icon={<AiOutlineEye fontSize={15} />} onClick={() => {
							if(onView){
								onView(stickyNote.id)
							}
						}}>View</MenuItem>
						<MenuItem icon={<AiOutlineEdit fontSize={15} />} onClick={() => {
							if(onEdit){
								onEdit(stickyNote.id)
							}
						}}>Edit</MenuItem>
						<MenuItem
							icon={<BsTrash fontSize={15} />}
							onClick={() => mutateDelStickyNote(stickyNote.id)}
						>
							Delete
						</MenuItem>
					</MenuList>
				</Menu>
			</HStack>
			<HStack width={'full'} justify="space-between" mt={5}>
				<Text color={'gray.400'}>04-06-2022</Text>
				<Box bgColor={stickyNote.color} w={4} h={4} borderRadius={'50%'}></Box>
			</HStack>
		</>
	)
}
