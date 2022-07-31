import { Box, Button, useDisclosure } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { JobLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import {
    deleteJobOfferLetterMutation,
    deleteJobOfferLettersMutation,
    updateJobOfferLetterMutation
} from 'mutations/jobOfferLetter'
import { useRouter } from 'next/router'
import { detailJobQuery } from 'queries/job'
import { offerLettersByJobQuery } from 'queries/jobOfferLetter'
import { useContext, useEffect } from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import AddOfferLetter from 'src/pages/job-offer-letters/add-job-offer-letters'
import UpdateOfferLetter from 'src/pages/job-offer-letters/[jobOfferLetterId]/update'
import { NextLayout } from 'type/element/layout'

export interface IOfferLetterProps {
	jobIdProp: string | number | null
}

const Interview: NextLayout | any = ({ jobIdProp }: IOfferLetterProps) => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { jobId: jobIdRouter } = router.query

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataInterviews, mutate: refetchOfferLetters } = offerLettersByJobQuery(
		isAuthenticated,
		jobIdProp || (jobIdRouter as string)
	)
    console.log(dataInterviews);

    	// get detail job Id
	const { data: dataDetailJob } = detailJobQuery(jobIdProp || (jobIdRouter as string))
    console.log(dataDetailJob);

	// mutate
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] =
		deleteJobOfferLetterMutation(setToast)
	const [deleteMany, { data: dataDlMany, status: statusDlMany }] =
		deleteJobOfferLettersMutation(setToast)
	const [updateStatus, { data: dataUpdateStatus, status: statusUpdate }] =
		updateJobOfferLetterMutation(setToast)

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

	//notice delete one success
	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				type: statusDlOne,
				msg: dataDlOne.message,
			})
			refetchOfferLetters()
		}
	}, [statusDlOne])

	//notice delete many success
	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: statusDlMany,
				msg: dataDlMany.message,
			})
			refetchOfferLetters()
		}
	}, [statusDlMany])

	//notice update success
	useEffect(() => {
		if (statusUpdate == 'success' && dataUpdateStatus) {
			setToast({
				type: statusUpdate,
				msg: dataUpdateStatus.message,
			})
			refetchOfferLetters()
		}
	}, [statusUpdate])

	return (
		<Box pb={8}>
            <Button onClick={onOpenAdd}>
                Add new
            </Button>
            <Button onClick={onOpenUpdate}>
                update
            </Button>
			<Drawer size="xl" title="Add Job Offer Letter" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddOfferLetter onCloseDrawer={onCloseAdd} job={dataDetailJob?.job} />
			</Drawer>
			<Drawer
				size="xl"
				title="Update Job Offer Letter"
				onClose={onCloseUpdate}
				isOpen={isOpenUpdate}
			>
				<UpdateOfferLetter onCloseDrawer={onCloseUpdate} jobOfferLetterId={1} />
			</Drawer>
		</Box>
	)
}

Interview.getLayout = JobLayout
export default Interview
