import { Button, useDisclosure } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
// import { allJobsQuery } from 'queries/job'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'
import AddInterviews from './add-interviews'
// import UpdateJob from './[jobId]/update'

const interviews: NextLayout = () => {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//Query ---------------------------------------------------------------------
	// const { data: dataAllJobs } = allJobsQuery(isAuthenticated)

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
			<Button onClick={onOpenAdd}>add interviews</Button>
			<Button onClick={onOpenUpdate}>update jobs</Button>
			<Drawer size="xl" title="Add Jobs" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddInterviews onCloseDrawer={onCloseAdd} />
			</Drawer>
			{/* <Drawer size="xl" title="Update Jobs" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateJob onCloseDrawer={onCloseUpdate} JobIdProp={8} />
			</Drawer> */}
		</>
	)
}
interviews.getLayout = ClientLayout

export default interviews
