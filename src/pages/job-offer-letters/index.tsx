import { Box, Button, useDisclosure } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'
import AddOfferLetter from './add-job-offer-letters'

const Job: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	// const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//Query ---------------------------------------------------------------------

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
		<Box pb={8}>
			<Button onClick={onOpenAdd}> Open add </Button>
			{/* <Button onClick={onOpenUpdate}> Open update </Button> */}
			<Drawer size="xl" title="Add Job Application" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddOfferLetter onCloseDrawer={onCloseAdd} />
			</Drawer>
		</Box>
	)
}
Job.getLayout = ClientLayout

export default Job
