import { v4 as uuidv4 } from "uuid"
import { Actor } from "./actor"

export enum TicketActivityType {
    // Ticket
    TICKET_CREATED = "ticket-created",
    TICKET_TITLE_UPDATED = "ticket-title-updated",
    TICKET_DESCRIPTION_UPDATED = "ticket-description-updated",
    TICKET_STATUS_UPDATED = "ticket-status-updated",

    // Comments
    COMMENT_CREATED = "comment-created",
    COMMENT_EDITED = "comment-edited",

    // Workflow
    WORKFLOW_TRIGGERED = "workflow-triggered",
    WORKFLOW_COMPLETED = "workflow-completed",
    WORKFLOW_FAILED = "workflow-failed",

}

export class TicketActivityMetadata {
    public readonly created: string
    public actor: Actor
    public readonly type: TicketActivityType

	constructor(
		actor: Actor,
		type: TicketActivityType
	) {
		this.created = new Date().toISOString()
		this.actor = actor
		this.type = type
	}
}

export class TicketActivity<T> {
    public readonly id: string
    public data: T
    public metadata: TicketActivityMetadata
  
    constructor(actor: Actor, data: T, type: TicketActivityType) {
      	this.id = uuidv4()
      	this.data = data
      	this.metadata = new TicketActivityMetadata(actor, type)
    }

  }





  