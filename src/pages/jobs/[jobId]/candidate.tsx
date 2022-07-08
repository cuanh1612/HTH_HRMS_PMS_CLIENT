import { Button, useDisclosure } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailJobQuery } from 'queries/job'
import { applicationsByJobQuery } from 'queries/jobApplication'
import { useContext, useEffect } from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import AddJobApplication from 'src/pages/job-applications/add-job-applications'

export interface ICandidateProps {
	jobIdProp: string | number | null
}

export default function Candidate({ jobIdProp }: ICandidateProps) {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { jobId: jobIdRouter } = router.query

	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataApplications } = applicationsByJobQuery(
		isAuthenticated,
		jobIdProp || (jobIdRouter as string)
	)

	const { data: detailJob } = detailJobQuery(
		isAuthenticated,
		jobIdProp || (jobIdRouter as string)
	)

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
			<Button onClick={onOpenAdd}>add Application</Button>
			<Drawer size="xl" title="Add Application" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddJobApplication dataJob={detailJob} onCloseDrawer={onCloseAdd} />
			</Drawer>
		</>
	)
}
