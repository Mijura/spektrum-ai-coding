import { ActivityData } from "@domain/value-objects/activity"
import { TaskStatus } from "@domain/value-objects/task"
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