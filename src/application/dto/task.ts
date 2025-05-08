import { ActivityData } from "@domain/types/activity"
import { TaskStatus } from "@domain/types/task"
export interface TaskDto {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TaskStatus
	activities: ActivityData[]
}