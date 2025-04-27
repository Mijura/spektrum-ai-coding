
import { IssueDto } from "@application/dto/issue"
import { Issue } from "@domain/entities/issue"

export interface UpdateIssueDescription {
    execute(issue: IssueDto): Promise<Issue>
}
