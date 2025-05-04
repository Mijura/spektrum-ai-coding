import { Issue } from "@domain/entities/issue"

export interface LeaveComment {
    execute(issueId: string, authorId: string, commentText: string): Promise<Issue>
} 