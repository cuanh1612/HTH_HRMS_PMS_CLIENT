import { Button, useDisclosure } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AddNoticeBoard from './add-notice-boards'
import UpdateNoticeBoard from './[noticeBoardId]/update'

export interface IProjectProps {}

export default function Event({}: IProjectProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [noticeBoardIdUpdate, setnoticeBoardIdUpdate] = useState<number | null>(4)

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

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
		<>
			<Button colorScheme="blue" onClick={onOpenAdd}>
				open add notice board
			</Button>
			<Button colorScheme="blue" onClick={onOpenUpdate}>
				open update notice board
			</Button>
			<Drawer size="xl" title="Add notice board" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddNoticeBoard onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Add notice board" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateNoticeBoard onCloseDrawer={onCloseUpdate} noticeBoardIdProp={noticeBoardIdUpdate} />
			</Drawer>
		</>
	)
}
