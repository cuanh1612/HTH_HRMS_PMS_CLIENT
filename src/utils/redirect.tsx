
import { employeeType } from 'type/basicTypes'

const redirectPage = (currentUser: employeeType): any => {
	if (currentUser.role.includes('Admin')) return '/dashboard'
	if (currentUser.role.includes('Client')) return '/private-dashboard-client'
	if (currentUser.role.includes('Employee')) return '/private-dashboard'
}
export default redirectPage
