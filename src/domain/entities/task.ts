
import { ActivityMetadata } from "@domain/value-objects/activity"
import { Activity } from "./activity"
import { v4 as uuidv4 } from 'uuid'
import { TaskCreatedActivity } from "./activities/task-created"
import { CommentLeft } from "./activities/comment-left"
import { TitleUpdated } from "./activities/title-updated"
import { DescriptionUpdated } from "./activities/description-updated"
import { Comment } from "@domain/value-objects/activity"
import { StartedWork } from "./activities/started-work"
import { FinishedWork } from "./activities/finished-work"
import { TaskStatus } from "@domain/value-objects/task"
import { EmitTaskUpdate } from "@domain/events/emitters/task-update"

export class Task {
	public readonly id: string
    public readonly created: string
    public updated: string | null
    public title: string
    public description: string
    public projectId: string
    public status: TaskStatus
	private activities: Activity<ActivityMetadata>[]

    private constructor(
		id: string,
		created: string,
		projectId: string,
		title: string,
		description: string,
		status: TaskStatus,
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

	@EmitTaskUpdate()
	updateTitle(userId: string, newTitle: string){
		this.title = newTitle
		this.updated = new Date().toISOString()
		this.activities.push(TitleUpdated.create(userId, this, newTitle))
	}

	@EmitTaskUpdate()
	updateDescription(userId: string, newDescription: string){
		this.description = newDescription
		this.updated = new Date().toISOString()
		this.activities.push(DescriptionUpdated.create(userId, this, newDescription))
	}

	@EmitTaskUpdate()
	leaveComment(authorId: string, commentText: string) {
		const comment: Comment = {
			authorId: authorId, 
			text: commentText
		}
		const commentActivity = CommentLeft.create(this, comment)
		this.activities.push(commentActivity)
	}

	@EmitTaskUpdate()
	startedWork(workerId: string, message: string): StartedWork {

		const activity = StartedWork.create(workerId, this, message)
		
		this.activities.push(activity)
		this.status = TaskStatus.WORK_IN_PROGRESS
		return activity as StartedWork
	}

	@EmitTaskUpdate()
	finishedWork(workerId: string, message: string): FinishedWork {

		const activity = FinishedWork.create(workerId, this, message)
		const startedWorkActivity = this.activities.findIndex(activity => activity instanceof StartedWork)
		if (startedWorkActivity) {
			this.activities.splice(startedWorkActivity, 1, activity)
		}

		return activity as FinishedWork
	}

	getActivityLog(): Activity<ActivityMetadata>[] {
		return this.activities
	}

	/** Rehydrate an task from persisted data */
	static rehydrate( data: {
			id: string, 
			created: string, 
			projectId: string, 
			title: string, 
			description: string, 
			status: TaskStatus, 
			updated: string | null, 
			activities: Activity<ActivityMetadata>[]
		}
	): Task {
		return new Task(data.id, data.created, data.projectId, data.title, data.description, data.status, data.updated, data.activities)
	}

	/** Create a new task */
	static create(userId: string, projectId: string, title: string, description: string): Task {
		const id = uuidv4()
		const created = new Date().toISOString()
		const task = new Task(id, created, projectId, title, description, TaskStatus.TODO, null, [])
		task.activities.push(TaskCreatedActivity.create(userId, task))
		return task
	}

}
