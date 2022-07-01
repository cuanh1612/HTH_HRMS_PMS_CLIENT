import { Button, useDisclosure } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
// import { allJobsQuery } from 'queries/job'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'
import AddJob from './add-jobs'
import UpdateJob from './[jobId]/update'

const Job: NextLayout = () => {
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
			<Button onClick={onOpenAdd}>add jobs</Button>
			<Button onClick={onOpenUpdate}>update jobs</Button>
			<Drawer size="xl" title="Add Jobs" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddJob onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Jobs" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateJob onCloseDrawer={onCloseUpdate} JobIdProp={8} />
			</Drawer>
		</>
	)
}
Job.getLayout = ClientLayout

export default Job
