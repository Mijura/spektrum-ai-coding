import { ActivityMetadata, ActivityType } from "@domain/types/activity"
import { TaskStatus } from "@domain/types/task"

export type ActivityRecord = {
	id: string
	type: ActivityType
	projectId: string
	taskId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
}

export interface TaskRecord {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TaskStatus
	activities: ActivityRecord[]
}