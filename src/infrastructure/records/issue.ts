import { ActivityMetadata, ActivityType } from "@domain/types/activity"
import { IssueStatus } from "@domain/types/issue"

export type ActivityRecord = {
	id: string
	type: ActivityType
	projectId: string
	issueId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
}

export interface IssueRecord {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: IssueStatus
	activities: ActivityRecord[]
}