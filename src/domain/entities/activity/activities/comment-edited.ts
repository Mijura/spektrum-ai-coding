import { IssueActivity, ActivityType } from "../issue-activity"

export interface CommentEditedMetadata {
	commentId: string
}

export class CommentEdited extends IssueActivity {

    constructor(
        id: string,
        type: ActivityType.COMMENT_EDITED, 
        issueId: string,
        userId: string,
        metadata: CommentEditedMetadata,
        occurredAt: string
    ) {
        super(id, type, issueId, userId, metadata, occurredAt)
    }

    static create(userId: string, issueId: string, commentId: string): IssueActivity {
        
        const id = this.generateId()
        const type = ActivityType.COMMENT_EDITED
        const occurredAt = this.now()
        
        const metadata: CommentEditedMetadata = {
            commentId: commentId
        }

        return new CommentEdited(id, type, issueId, userId, metadata, occurredAt)
    }
}
