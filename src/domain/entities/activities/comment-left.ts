import { CommentLeftMetadata, ActivityType } from "@domain/types/activity"
import { Activity } from "../activity"
import { Comment } from "../../types/activity"
import { Issue } from "../issue"

export class CommentLeft extends Activity<CommentLeftMetadata> {

    constructor(
        id: string,
        type: ActivityType.COMMENT_LEFT,
        projectId: string,
        issueId: string,
        userId: string,
        metadata: CommentLeftMetadata,
        occurredAt: string
    ) {
        super(id, type, projectId, issueId, userId, metadata, occurredAt)
    }

    static create(issue: Issue, comment: Comment): Activity<CommentLeftMetadata> {

        const id = this.generateId()
        const type = ActivityType.COMMENT_LEFT
        const occurredAt = this.now()

        const metadata: CommentLeftMetadata = {
            commentText: comment.text,
            authorId: comment.authorId
        }

        return new CommentLeft(id, type, issue.projectId, issue.id, comment.authorId, metadata, occurredAt)
    }

}