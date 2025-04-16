import { Actor } from "./actor"
import { TicketActivity, TicketActivityType } from "./ticket-activity"

export class Comment {
    content: string
    edited: boolean

    constructor(content: string) {
        this.content = content
        this.edited = false
    }

    editContent(content: string) {
        this.content = content
        this.edited = true
    }
    
}

export class CommentActivity extends TicketActivity<Comment> {

    private constructor(actor: Actor, data: Comment) {
        super(actor, data, TicketActivityType.COMMENT_CREATED)
    }

    static create(actor: Actor, comment: Comment): CommentActivity {
        return new CommentActivity(actor, comment)
    }
}