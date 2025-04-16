import { TicketDto } from "@application/dto/ticket"
import { v4 as uuidv4 } from "uuid"
import { TicketActivity, TicketActivityType } from "./activities/ticket-activity"
import { Comment, CommentActivity } from "./activities/comment"
import { Actor } from "./activities/actor"

export enum TicketStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export type TicketActivities = TicketActivity<Comment> []

export class Ticket {
	public readonly id: string
    public readonly created: string
    public updated: string | null
    public title: string
    public description: string
    public projectId: string
    public status: TicketStatus
	public activities: TicketActivities
	
    private constructor(
		id: string,
		projectId: string,
		title: string,
		description: string,
		status: TicketStatus,
        created: string,
		updated: string | null,
		activities: TicketActivities
	) {
		this.id = id
		this.projectId = projectId
		this.title = title
		this.description = description
		this.status = status
		this.created = created
		this.updated = updated
		this.activities = activities
	}

	// Factory method to create a new ticket
	static create(projectId: string, title: string, description: string): Ticket {
		const id = uuidv4() // Generate unique ID
		const created = new Date().toISOString() // ISO format
	
		return new Ticket(id, projectId, title, description, TicketStatus.TODO, created, null, [])
	}

	update(ticket: TicketDto): Ticket {
		this.title = ticket.title
		this.description = ticket.description
		this.status = ticket.status
		this.updated = new Date().toISOString()
		return this
	}

	updateStatus(status: TicketStatus){
		this.status = status
		this.updated = new Date().toISOString()
	}

	updateTitle(title: string){
		this.title = title
		this.updated = new Date().toISOString()
	}

	updateDescription(description: string){
		this.description = description
		this.updated = new Date().toISOString()
	}

	addComment(actor: Actor, content: string){
		const comment = new Comment(content)
		this.activities.push(CommentActivity.create(actor, comment))
	}

	editComment(actor: Actor, activityId: string, content: string){
		const activity = this.activities.find(activity => activity.id === activityId)
		if(!activity) {
			throw new Error("Comment activity not found")
		}

		if(activity.metadata.type !== TicketActivityType.COMMENT_CREATED 
			&& activity.metadata.type !== TicketActivityType.COMMENT_EDITED) {
			throw new Error("Activity is not a comment")
		}

		if(activity.metadata.actor.name !== actor.name) {
			throw new Error("Actor name does not match comment author")
		}

		activity.data.editContent(content)
	}

	/** Restore method to rehydrate a ticket from persisted data */
	static restore(data: {
		id: string
		projectId: string
        title: string
        description: string
        status: TicketStatus
        created: string
        updated: string | null
        activities: TicketActivities
	}): Ticket {
		return new Ticket(data.id, data.projectId, data.title, data.description, data.status, data.created, data.updated, data.activities)
	}


}
