import { ActivityMetadata, ActivityType } from "@domain/value-objects/activity"
import { TaskStatus } from "@domain/value-objects/task"

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