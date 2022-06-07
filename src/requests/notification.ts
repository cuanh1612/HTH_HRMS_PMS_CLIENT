import { NotificationMutaionResponse } from 'type/mutationResponses'
import { deleteData, getData } from 'utils/fetchData'

//Function handle get notification by current user
export const notificationByCurrentUserRequest = async (url: string) => {
	return await getData<NotificationMutaionResponse>({
		url: `http://localhost:4000/api/${url}`,
	})
}

//Handle to delete notification
export const deleteNotificationRequest = async (id: string | number) => {
	return await deleteData<NotificationMutaionResponse>({
		url: `http://localhost:4000/api/notifications/${id}`,
	})
}
