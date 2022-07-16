import { Box, Button, Grid, GridItem, useColorMode, useDisclosure, VStack } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import StickyNoteItem from 'components/StickyNoteItem'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allStickyNoteQuery } from 'queries/stickyNote'
import { useContext, useEffect, useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import AddStickyNotes from './add-sticky-notes'
import DetailStickyNote from './[stickyNoteId]'
import UpdateStickyNote from './[stickyNoteId]/update-sticky-note'

export default function StickysNote() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	//State --------------------------------------------------------------------
	const [stickyNoteShow, setStickyNoteShow] = useState<string | number>()

	//Query --------------------------------------------------------------------
	// get all sticky note
	const { data: allStickyNote } = allStickyNoteQuery(isAuthenticated)

	//Mutation ---------------------------------------------------------

	//Setup modal ----------------------------------------------------------------
	const {
		isOpen: isOpenCreateNote,
		onOpen: onOpenCreateNote,
		onClose: onCloseCreateNote,
	} = useDisclosure()

	const {
		isOpen: isOpenDetailNote,
		onOpen: onOpenDetailNote,
		onClose: onCloseDetailNote,
	} = useDisclosure()

	const {
		isOpen: isOpenUpdateNote,
		onOpen: onOpenUpdateNote,
		onClose: onCloseUpdateNote,
	} = useDisclosure()

	//Function ------------------------------------------------------------------
	//handle open detail note
	const openDetailNote = (stickyNoteId: string | number) => {
		setStickyNoteShow(stickyNoteId)
		onOpenDetailNote()
	}

	//handle open update note
	const openUpdateNote = (stickyNoteId: string | number) => {
		setStickyNoteShow(stickyNoteId)
		onOpenUpdateNote()
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

	return (
		<Box p={10} bgColor={colorMode == 'dark' ? undefined : '#f2f4f7'} minHeight={'100vh'}>
			<VStack spacing={6} align={'start'}>
				<Button
					colorScheme="blue"
					leftIcon={<AiOutlinePlusCircle />}
					onClick={onOpenCreateNote}
				>
					Add note
				</Button>

				<Grid templateColumns="repeat(4, 1fr)" gap={6} w={'full'}>
					{allStickyNote?.stickyNotes?.map((stickyNote) => (
						<GridItem
							key={stickyNote.id}
							colSpan={[4, 2, 2, 2, 1]}
							bgColor={colorMode == 'dark' ? '#00000045' : 'white'}
							width={'full'}
							p={5}
							borderRadius={5}
						>
							<StickyNoteItem
								stickyNote={stickyNote}
								onView={openDetailNote}
								onEdit={openUpdateNote}
							/>
						</GridItem>
					))}
				</Grid>
			</VStack>

			<Drawer
				size="xl"
				title="Add Sticky Note"
				onClose={onCloseCreateNote}
				isOpen={isOpenCreateNote}
			>
				<AddStickyNotes onCloseDrawer={onCloseCreateNote} />
			</Drawer>

			<Drawer
				size="xl"
				title="Detail Sticky Note"
				onClose={onCloseDetailNote}
				isOpen={isOpenDetailNote}
			>
				<DetailStickyNote stickNoteId={stickyNoteShow} />
			</Drawer>

			<Drawer
				size="xl"
				title="Updaet Sticky Note"
				onClose={onCloseUpdateNote}
				isOpen={isOpenUpdateNote}
			>
				<UpdateStickyNote stickNoteId={stickyNoteShow} onCloseDrawer={onCloseUpdateNote} />
			</Drawer>
		</Box>
	)
}
