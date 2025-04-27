
import { Issue } from "@domain/entities/issue"

export interface CreateIssue {
    execute(projectId: string, title: string, description: string): Promise<Issue>
}
