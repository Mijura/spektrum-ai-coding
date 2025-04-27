import { IssueDto } from "@application/dto/issue"
import { Issue } from "@domain/entities/issue"


export interface UpdateIssueTitle {
    execute(issue: IssueDto): Promise<Issue>
}
