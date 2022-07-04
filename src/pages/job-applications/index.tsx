import { Button, useDisclosure } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'
import AddJobApplications from './add-job-applications'
import UpdateJobApplication from './[jobApplicationId]/update'
// import UpdateJob from './[jobId]/update'

const jobApplications: NextLayout = () => {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//Query ---------------------------------------------------------------------
	// const { data: dataAllJobApplications } = allJobApplicationsQuery(isAuthenticated)

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
			<Button onClick={onOpenAdd}>add job application</Button>
			<Button onClick={onOpenUpdate}>update jobs</Button>
			<Drawer size="xl" title="Add Job Application" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddJobApplications onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Jobs" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateJobApplication onCloseDrawer={onCloseUpdate} jobApplicationId={12} />
			</Drawer>
		</>
	)
}
jobApplications.getLayout = ClientLayout

export default jobApplications
