import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
// import {
// 	allTasksByEmployeeQuery,
// 	countProjectsEmployeeQuery,
// 	detailEmployeeQuery,
// 	hoursLoggedEmployeeQuery,
// 	lateAttendanceEmployeeQuery,
// 	leavesTakenEmployeeQuery,
// 	openTasksEmployeeQuery
// } from 'queries'
import { useContext, useEffect } from 'react'

export default function DetailEmployee() {
	// const { isOpen, onOpen, onClose } = useDisclosure()
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	// const { employeeId } = router.query

	//Query -------------------------------------------------------------------------------------------------
	// const { data: dataEmployee } = detailEmployeeQuery(isAuthenticated, employeeId as string)

	// const { data: openTasksEmployee } = openTasksEmployeeQuery(
	// 	isAuthenticated,
	// 	employeeId as string
	// )

	// const { data: hoursLoggedEmployee } = hoursLoggedEmployeeQuery(
	// 	isAuthenticated,
	// 	employeeId as string
	// )

	// const { data: countProjectsEmployee } = countProjectsEmployeeQuery(
	// 	isAuthenticated,
	// 	employeeId as string
	// )

	// const { data: countLateAttendancesEmployee } = lateAttendanceEmployeeQuery(
	// 	isAuthenticated,
	// 	employeeId as string
	// )

	// const { data: countLeavesTakenEmployee } = leavesTakenEmployeeQuery(
	// 	isAuthenticated,
	// 	employeeId as string
	// )

	// const { data: allTasks } = allTasksByEmployeeQuery(isAuthenticated, employeeId as string)

	//mutation ----------------------------------------------------------------------------------------------

	//function-------------------------------------------------------------------

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

	return <></>
}
