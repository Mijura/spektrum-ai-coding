import { Issue } from "@domain/entities/issue"

export interface FetchIssues {
    execute(projectId: string): Promise<Issue[]> 
}

