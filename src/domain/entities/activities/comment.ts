import { Activity, ActivityType } from "./activity"

export interface CommentActivityData {
    content: string
}

export class Comment extends Activity<CommentActivityData> {
    private constructor(
        id: string,
        date: string,
        assignee: string,
        projectId: string,
        ticketId: string,
        data: CommentActivityData
    ) {
        super(id, date, assignee, ActivityType.COMMENT, projectId, ticketId, data)
    }

    static create(id: string, date: string, assignee: string, projectId: string, ticketId: string, content: string): Comment {
        const data: CommentActivityData = {
            content: content
        }
        return new Comment(id, date, assignee, projectId, ticketId, data)
    }
}