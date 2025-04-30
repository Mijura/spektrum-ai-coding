import { ActivityData } from "@domain/types/activity"
import { IssueStatus } from "@domain/types/issue"
export interface IssueDto {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: IssueStatus
	activities: ActivityData[]
}