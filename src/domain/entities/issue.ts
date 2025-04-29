
import { ActivityMetadata, ActivityType, CommentLeftMetadata } from "@domain/types/activity"
import { Activity } from "./activity"
import { v4 as uuidv4 } from 'uuid'
import { IssueCreatedActivity } from "./activities/issue-created"
import { CommentLeft } from "./activities/comment-left"
import { TitleUpdated } from "./activities/title-updated"
import { DescriptionUpdated } from "./activities/description-updated"
import { Comment } from "./comment"
export enum IssueStatus {
    TODO = "Todo",
    IN_PROGRESS = "In progress",
    DONE = "Done",
}

export class Issue {
	public readonly id: string
    public readonly created: string
    public updated: string | null
    public title: string
    public description: string
    public projectId: string
    public status: IssueStatus
	private activities: Activity<ActivityMetadata>[]
	
    private constructor(
		id: string,
		created: string,
		projectId: string,
		title: string,
		description: string,
		status: IssueStatus,
		updated: string | null,
		activities: Activity<ActivityMetadata>[]
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
		this.activities.push(TitleUpdated.create(userId, this, newTitle))
	}

	updateDescription(userId: string, newDescription: string){
		this.description = newDescription
		this.updated = new Date().toISOString()
		this.activities.push(DescriptionUpdated.create(userId, this, newDescription))
	}

	leaveComment(comment: Comment) {
		const commentActivity = CommentLeft.create(this, comment)
		this.activities.push(commentActivity)
	}

	editComment(userId: string, commentId: string, newText: string){		
		const commentActivities: CommentLeft[] = this.activities.filter(a => a.type === ActivityType.COMMENT_LEFT) as CommentLeft[]
		let commentActivity = commentActivities.find(a => (a.metadata as CommentLeftMetadata).commentId === commentId)

		if (!commentActivity) {
		  throw new Error('Comment not found')
		}
		if (commentActivity.userId !== userId) {
		  throw new Error('Only the comment author can edit it')
		}
	
		commentActivity.edit(newText)
	}

	changeStatus(status: IssueStatus) {
		this.status = status
		this.updated = new Date().toISOString()
	}

	getActivityLog(): Activity<ActivityMetadata>[] {
		return this.activities
	}

	/** Rehydrate an issue from persisted data */
	static rehydrate( data: {
			id: string, 
			created: string, 
			projectId: string, 
			title: string, 
			description: string, 
			status: IssueStatus, 
			updated: string | null, 
			activities: Activity<ActivityMetadata>[]
		}
	): Issue {
		return new Issue(data.id, data.created, data.projectId, data.title, data.description, data.status, data.updated, data.activities)
	}

	/** Create a new issue */
	static create(userId: string, projectId: string, title: string, description: string): Issue {
		const id = uuidv4()
		const created = new Date().toISOString()
		const issue = new Issue(id, created, projectId, title, description, IssueStatus.TODO, null, [])
		issue.activities.push(IssueCreatedActivity.create(userId, issue))
		return issue
	}

}
