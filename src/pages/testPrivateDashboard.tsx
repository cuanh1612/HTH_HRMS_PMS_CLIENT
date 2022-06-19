import { Box } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allTasksByEmployeeQuery, countCompleteTasksQuery, countPendingTasksQuery, countProjectsEmployeeQuery, countStatusProjectsQuery, detailEmployeeQuery, eventsByEmployeeQuery, hoursLoggedEmployeeQuery, openTasksEmployeeQuery } from 'queries'
import { useContext, useEffect } from 'react'

export interface ITaskCategoryProps {}

export default function TaskCategory({}: ITaskCategoryProps) {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()

    //Query -------------------------------------------------------------------------------------------------
	const { data: dataEmployee } = detailEmployeeQuery(isAuthenticated, currentUser?.role !== "Client" ? currentUser?.id : undefined)

	const { data: openTasksEmployee } = openTasksEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== "Client" ? currentUser?.id : undefined
	)

	const { data: hoursLoggedEmployee } = hoursLoggedEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== "Client" ? currentUser?.id : undefined
	)

	const { data: countProjectsEmployee } = countProjectsEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== "Client" ? currentUser?.id : undefined
	)

    const { data: dataAllTasks } = allTasksByEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== "Client" ? currentUser?.id : undefined
	)

    const { data: countPendingTasks } = countPendingTasksQuery(
		isAuthenticated,
		currentUser?.role !== "Client" ? currentUser?.id : undefined
	)
    

    const { data: countCompleteTasks } = countCompleteTasksQuery(
		isAuthenticated,
		currentUser?.role !== "Client" ? currentUser?.id : undefined
	)

    const { data: countStatusProjects } = countStatusProjectsQuery(
		isAuthenticated,
		currentUser?.role !== "Client" ? currentUser?.id : undefined
	)

    const { data: dataEvents } = eventsByEmployeeQuery(
		isAuthenticated,
		currentUser?.role !== "Client" ? currentUser?.id : undefined
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
