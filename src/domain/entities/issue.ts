
import { ActivityMetadata } from "@domain/types/activity"
import { Activity } from "./activity"
import { v4 as uuidv4 } from 'uuid'
import { IssueCreatedActivity } from "./activities/issue-created"
import { CommentLeft } from "./activities/comment-left"
import { TitleUpdated } from "./activities/title-updated"
import { DescriptionUpdated } from "./activities/description-updated"
import { Comment } from "@domain/types/activity"
import { StartedWork } from "./activities/started-work"
import { FinishedWork } from "./activities/finished-work"
import { IssueStatus } from "@domain/types/issue"
import { EmitIssueActivity } from "@domain/decorators/emit-issue-update"

export class Issue {
	public readonly id: string
    public readonly created: string
    public updated: string | null
    public title: string
    public description: string
    public projectId: string
    public status: IssueStatus
	private activities: Activity<ActivityMetadata>[]
	private assignedTo?: string

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

	@EmitIssueActivity()
	updateTitle(userId: string, newTitle: string){
		this.title = newTitle
		this.updated = new Date().toISOString()
		this.activities.push(TitleUpdated.create(userId, this, newTitle))
	}

	@EmitIssueActivity()
	updateDescription(userId: string, newDescription: string){
		this.description = newDescription
		this.updated = new Date().toISOString()
		this.activities.push(DescriptionUpdated.create(userId, this, newDescription))
	}

	@EmitIssueActivity()
	leaveComment(authorId: string, commentText: string) {
		const comment: Comment = {
			authorId: authorId, 
			text: commentText
		}
		const commentActivity = CommentLeft.create(this, comment)
		this.activities.push(commentActivity)
	}

	@EmitIssueActivity()
	startedWork(workerId: string, phase: string, message: string): StartedWork {
		if (this.status === IssueStatus.WORK_IN_PROGRESS) {
			throw new Error("Worker is already working on a issue")
		}

		const activity = StartedWork.create(workerId, this, phase, message)
		
		this.activities.push(activity)
		this.assignedTo = workerId
		this.status = IssueStatus.WORK_IN_PROGRESS
		return activity as StartedWork
	}

	@EmitIssueActivity()
	finishedWork(workerId: string, phase: string, message: string): FinishedWork {
		if (!this.assignedTo) {
			throw new Error("Worker has not started working on this issue")
		}

		if (this.assignedTo !== workerId) {
			throw new Error("Worker is not working on this issue")
		}

		const activity = FinishedWork.create(workerId, this, phase, message)
		const startedWorkActivity = this.activities.findIndex(activity => activity instanceof StartedWork)
		if (startedWorkActivity) {
			this.activities.splice(startedWorkActivity, 1, activity)
		}
		this.assignedTo = undefined
		this.status = IssueStatus.READY_FOR_NEXT_PHASE
		return activity as FinishedWork
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
