import { Activity } from "./activity"
import { Comment } from "./comment"
import { v4 as uuidv4 } from 'uuid'

export enum TicketStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export class Ticket {
	public readonly id: string
    public readonly created: string
    public updated: string | null
    public title: string
    public description: string
    public projectId: string
    public status: TicketStatus
	private comments: Comment[]
  	private activities: Activity[]
	
    private constructor(
		id: string,
		created: string,
		projectId: string,
		title: string,
		description: string,
		status: TicketStatus,
		updated: string | null,
		comments: Comment[],
		activities: Activity[]
	) {
		this.id = id
		this.projectId = projectId
		this.title = title
		this.description = description
		this.status = status
		this.created = created
		this.updated = updated
		this.comments = comments
		this.activities = activities
	}

	updateTitle(userId: string, newTitle: string){
		this.title = newTitle
		this.updated = new Date().toISOString()
		this.activities.push(Activity.titleUpdated(userId, this.id, this.title, newTitle))
	}

	updateDescription(userId: string, description: string){
		this.description = description
		this.updated = new Date().toISOString()
		this.activities.push(Activity.descriptionUpdated(userId, this.id, this.description, description))
	}

	leaveComment(commentId: string, commentText: string, authorId: string) {
		const comment = Comment.create(commentId, authorId, commentText)
		this.comments.push(comment)
		this.activities.push(Activity.commented(authorId, this.id, commentId))
	}

	editComment(commentId: string, newText: string, userId: string){
		const comment = this.comments.find(c => c.id === commentId)
		if (!comment) {
		  throw new Error('Comment not found')
		}
		if (comment.authorId !== userId) {
		  throw new Error('Only the comment author can edit it')
		}
	
		comment.edit(newText)
		this.activities.push(Activity.commentEdited(userId, this.id, commentId))
	
	}

	getActivityLog(): Activity[] {
		return this.activities
	}
	
	getComments(): Comment[] {
		return this.comments
	}

	/** Rehydrate a ticket from persisted data */
	static rehydrate( data: {
			id: string, 
			created: string, 
			projectId: string, 
			title: string, 
			description: string, 
			status: TicketStatus, 
			updated: string | null, 
			comments: Comment[],
			activities: Activity[]
		}
	): Ticket {
		return new Ticket(data.id, data.created, data.projectId, data.title, data.description, data.status, data.updated, data.comments, data.activities)
	}

	/** Create a new ticket */
	static create(userId: string, projectId: string, title: string, description: string): Ticket {
		const id = uuidv4()
		const created = new Date().toISOString()
		const ticket = new Ticket(id, created, projectId, title, description, TicketStatus.TODO, null, [], [])
		ticket.activities.push(Activity.ticketCreated(userId, id, title, description))
		return ticket
	}

}
