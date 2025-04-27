import { Activity, ActivityType } from "../activity"

export interface CommentLeftMetadata {
	commentId: string
}

export class CommentLeft extends Activity {

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

    static create(userId: string, issueId: string, commentId: string): Activity {

        const id = this.generateId()
        const type = ActivityType.COMMENT_LEFT
        const occurredAt = this.now()

        const metadata: CommentLeftMetadata = {
            commentId: commentId
        }

        return new CommentLeft(id, type, issueId, userId, metadata, occurredAt)
    }
}