import { Comment, CommentActivity } from "@domain/entities/activities/comment"
import { ActivityInitiator, Human } from "@domain/entities/activities/initiator"
import { TicketActivity } from "@domain/entities/activities/ticket-activity"
import { Ticket } from "@domain/entities/ticket"
import { TicketActivityServicePort } from "@domain/services/ticket-activity-service"

export class TicketActivityManager implements TicketActivityServicePort {
    createTicket(initiatorName: string, title: string, description: string): TicketActivity<Ticket> {
        throw new Error("Method not implemented.")
    }

    createComment(initiatorName: string, ticketId: string, content: string): TicketActivity<Comment> {
        const initiator: ActivityInitiator = new Human(initiatorName)
        return CommentActivity.create(initiator, ticketId, content)
    }


}