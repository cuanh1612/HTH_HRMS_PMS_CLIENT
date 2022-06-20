import { IpendingTasks } from "type/mutationResponses"
import { getData } from "utils/fetchData"


export const getDataDashBoardRequest = async (url: string) => {
	return await getData<IpendingTasks>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/${url}`,
	})
}