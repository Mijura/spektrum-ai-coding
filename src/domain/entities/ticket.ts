import { TicketActivity, TicketActivityType } from "./activities/ticket-activity"
import { Comment, CommentActivity } from "./activities/comment-activity"
import { Actor } from "./activities/actor"
import { v4 as uuidv4 } from 'uuid'

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
	private activities: TicketActivities
	
    private constructor(
		id: string,
		created: string,
		projectId: string,
		title: string,
		description: string,
		status: TicketStatus,
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

	/** Rehydrate a ticket from persisted data */
	static rehydrate(
			id: string, 
			created: string, 
			projectId: string, 
			title: string, 
			description: string, 
			status: TicketStatus, 
			updated: string | null, 
			activities: TicketActivities
	): Ticket 
		{
			return new Ticket(id, created, projectId, title, description, status, updated, activities)
	}

	/** Create a new ticket */
	static create(projectId: string, title: string, description: string): Ticket {
		const id = uuidv4()
		const created = new Date().toISOString()
		return new Ticket(id, created, projectId, title, description, TicketStatus.TODO, null, [])
	}

}
