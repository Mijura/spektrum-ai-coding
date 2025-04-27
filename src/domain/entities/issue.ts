
import { Comment } from "./comment"
import { v4 as uuidv4 } from 'uuid'

export enum IssueStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export enum WorkflowStatus {
	IN_PROGRESS = "IN PROGRESS",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
}

export class Issue {
	public readonly id: string
    public readonly created: string
    public updated: string | null
    public title: string
    public description: string
    public projectId: string
    public status: IssueStatus
	private comments: Comment[]
	
    private constructor(
		id: string,
		created: string,
		projectId: string,
		title: string,
		description: string,
		status: IssueStatus,
		updated: string | null,
		comments: Comment[]
	) {
		this.id = id
		this.projectId = projectId
		this.title = title
		this.description = description
		this.status = status
		this.created = created
		this.updated = updated
		this.comments = comments
	}

	updateTitle(userId: string, newTitle: string){
		this.title = newTitle
		this.updated = new Date().toISOString()
	}

	updateDescription(userId: string, description: string){
		this.description = description
		this.updated = new Date().toISOString()
	}

	leaveComment(authorId: string, commentText: string) {
		const comment = Comment.create(authorId, commentText)
		this.comments.push(comment)
	}

	editComment(userId: string, commentId: string, newText: string){
		const comment = this.comments.find(c => c.id === commentId)
		if (!comment) {
		  throw new Error('Comment not found')
		}
		if (comment.authorId !== userId) {
		  throw new Error('Only the comment author can edit it')
		}
	
		comment.edit(newText)
	
	}

	changeStatus(userId: string, status: IssueStatus) {
		this.status = status
		this.updated = new Date().toISOString()
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
			status: IssueStatus, 
			updated: string | null, 
			comments: Comment[]
		}
	): Issue {
		return new Issue(data.id, data.created, data.projectId, data.title, data.description, data.status, data.updated, data.comments)
	}

	/** Create a new ticket */
	static create(userId: string, projectId: string, title: string, description: string): Issue {
		const id = uuidv4()
		const created = new Date().toISOString()
		const issue = new Issue(id, created, projectId, title, description, IssueStatus.TODO, null, [])
		return issue
	}

}
