import { ActivityInitiator } from "./initiator"
import { TicketActivity, TicketActivityType } from "./ticket-activity"

export class Comment {
    content: string
    ticketId: string
    edited: boolean

    constructor(content: string, ticketId: string) {
        this.content = content
        this.ticketId = ticketId
        this.edited = false
    }

}

export class CommentActivity extends TicketActivity<Comment> {

    constructor(initiator: ActivityInitiator, data: Comment) {
        super(initiator, data, TicketActivityType.COMMENT)
    }

    static create(initiator: ActivityInitiator, ticketId: string, content: string): CommentActivity {

        const data: Comment = new Comment(content, ticketId)
        return new CommentActivity(initiator, data)
    }
}