import { LeaveComment } from "@domain/use-cases/issue/leave-comment"
import { IssueRepository } from "@domain/repositories/issue-repository"
import { Issue } from "@domain/entities/issue"
import { Comment } from "@domain/entities/comment"
export class LeaveCommentUseCase implements LeaveComment {
    constructor(
        private readonly issueRepository: IssueRepository
    ) {}

    async execute(issueId: string, authorId: string, commentText: string): Promise<Issue> {
        try {
            console.log(`Adding comment to issue ${issueId} by user ${authorId}.`)
            const issue: Issue | null = await this.issueRepository.findById(issueId)

            if (!issue) {
                throw new Error("Issue not found.")
            }

            // TODO: Get the user id from the context
            const comment = Comment.create(authorId, commentText)
            issue.leaveComment(comment)

            return await this.issueRepository.save(issue)
        } catch (error) {
            console.error("Error during adding comment:", error)
            throw new Error("Failed to add comment.")
        }
    }
} 