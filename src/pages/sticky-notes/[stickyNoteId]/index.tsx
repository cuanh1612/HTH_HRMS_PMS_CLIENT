import { Box, Grid, GridItem } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailStickyNoteQuery } from 'queries/stickyNote'
import { useContext, useEffect } from 'react'

export interface IDetailStickyNoteProps {
	onCloseDrawer?: () => void
	stickNoteId?: string | number
}

export default function DetailStickyNote({
	stickNoteId: stickyNoteIdProp,
}: IDetailStickyNoteProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { stickyNoteId: stickyNoteRouter } = router.query

	//Query -------------------------------------------------------------
	const { data: dataDetailStickyNote } = detailStickyNoteQuery(
		isAuthenticated,
		stickyNoteIdProp || (stickyNoteRouter as string)
	)

	//mutation -----------------------------------------------------------

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
		<Box pos="relative" p={6}>
			<Grid templateColumns="repeat(2, 1fr)" gap={6}>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Color:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					<Box
						bgColor={dataDetailStickyNote?.stickynote?.color}
						height={5}
						w={5}
						borderRadius={5}
					></Box>
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Note:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					<div
						dangerouslySetInnerHTML={{
							__html: dataDetailStickyNote?.stickynote?.note
								? dataDetailStickyNote?.stickynote?.note
								: '',
						}}
					/>
				</GridItem>
			</Grid>
		</Box>
	)
}
