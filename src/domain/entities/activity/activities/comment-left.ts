import { IssueActivity, ActivityType } from "../issue-activity"

export interface CommentLeftMetadata {
	commentId: string
}

export class CommentLeft extends IssueActivity {

    constructor(
        id: string,
        type: ActivityType.COMMENT_LEFT,
        issueId: string,
        userId: string,
        metadata: CommentLeftMetadata,
        occurredAt: string
    ) {
        super(id, type, issueId, userId, metadata, occurredAt)
    }

    static create(userId: string, issueId: string, commentId: string): IssueActivity {

        const id = this.generateId()
        const type = ActivityType.COMMENT_LEFT
        const occurredAt = this.now()

        const metadata: CommentLeftMetadata = {
            commentId: commentId
        }

        return new CommentLeft(id, type, issueId, userId, metadata, occurredAt)
    }
}