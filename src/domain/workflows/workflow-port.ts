import { Issue } from "@domain/entities/issue"

export interface WorkflowPort {
	run(issue: Issue, accountId?: string): Promise<any>
}
