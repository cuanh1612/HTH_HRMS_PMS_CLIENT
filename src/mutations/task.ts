import { changePositionRequest } from "requests/task"
import { deleteTaskRequest } from "requests/task"
import { TToast } from "type/basicTypes"
import useMutation from "use-mutation"

// delete one
export const deleteTaskMutation = (setToast: TToast) => {
	return useMutation(deleteTaskRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}

//update position of task
export const changePositionMutation = (setToast: TToast) => {
	return useMutation(changePositionRequest, {
		onFailure({ error }) {
			setToast({
				msg: error.message,
				type: 'error',
			})
		},
	})
}