import { Box } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allTasksByEmployeeQuery, clientCountProjectStatusQuery, clientTotalProejctsQuery, countCompleteTasksQuery, countContractSignedQuery, countPendingTasksQuery, countProjectsEmployeeQuery, countStatusProjectsQuery, detailEmployeeQuery, eventsByEmployeeQuery, hoursLoggedEmployeeQuery, openTasksEmployeeQuery, pendingMilestoneClientQuery } from 'queries'
import { useContext, useEffect } from 'react'

export interface ITaskCategoryProps {}

export default function TaskCategory({}: ITaskCategoryProps) {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()

    //Query -------------------------------------------------------------------------------------------------

	const { data: dataTotalProject } = clientTotalProejctsQuery(
		isAuthenticated,
		currentUser?.role === "Client" ? currentUser?.id : undefined
	)

	const { data: dataCountContractSigned } = countContractSignedQuery(
		isAuthenticated,
		currentUser?.role === "Client" ? currentUser?.id : undefined
	)

	const { data: dataCountProjectStatus } = clientCountProjectStatusQuery(
		isAuthenticated,
		currentUser?.role === "Client" ? currentUser?.id : undefined
	)

	const { data: dataPendingMilestone } = pendingMilestoneClientQuery(
		isAuthenticated,
		currentUser?.role === "Client" ? currentUser?.id : undefined
	)
    
	//Useeffect ---------------------------------------------------------
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

	return <Box></Box>
}
