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
	private comments: Comment[] = []
  	private activities: Activity[] = []
	
    private constructor(
		id: string,
		created: string,
		projectId: string,
		title: string,
		description: string,
		status: TicketStatus,
		updated: string | null,
		activities: Activity[]
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

	updateTitle(userId: string, newTitle: string){
		this.title = newTitle
		this.updated = new Date().toISOString()
		this.activities.push(Activity.titleUpdated(userId, this.id, this.title, newTitle))
	}

	updateDescription(description: string){
		this.description = description
		this.updated = new Date().toISOString()
	}

	leaveComment(commentId: string, commentText: string, authorId: string) {
		const comment = new Comment(commentId, authorId, commentText)
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
		return [...this.activities]
	}
	
	getComments(): Comment[] {
		return [...this.comments]
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
			activities: Activity[]
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
