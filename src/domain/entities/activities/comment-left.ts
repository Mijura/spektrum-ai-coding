import { CommentLeftMetadata, ActivityType } from "@domain/types/activity"
import { Activity } from "../activity"
import { Comment } from "../comment"

export class CommentLeft extends Activity<CommentLeftMetadata> {

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

    static create(userId: string, issueId: string, comment: Comment): Activity<CommentLeftMetadata> {

        const id = this.generateId()
        const type = ActivityType.COMMENT_LEFT
        const occurredAt = this.now()

        const metadata: CommentLeftMetadata = {
            commentId: comment.id,
            commentText: comment.text,
            edited: false,
            lastEditedAt: null
        }

        return new CommentLeft(id, type, issueId, userId, metadata, occurredAt)
    }

    edited(commentText: string): void {
        this.metadata.commentText = commentText
        this.metadata.edited = true
        this.metadata.lastEditedAt = Activity.now()
    }
}