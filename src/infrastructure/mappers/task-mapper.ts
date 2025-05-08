import { TaskRecord } from "@infrastructure/records/task"
import { Task } from "@domain/entities/task"


export class TaskMapper {

  /** Converts an Task domain entity to a raw record */
  static toRecord(task: Task): TaskRecord {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        created: task.created,
        updated: task.updated,
        status: task.status,
        activities: task.getActivityLog().map(activity => ({
            id: activity.id,
            type: activity.type,
            projectId: activity.projectId,
            taskId: activity.taskId,
            userId: activity.userId,
            metadata: activity.metadata,
            occurredAt: activity.occurredAt,
        }))
    }
  }

  /** Converts a raw task record back to an Task domain entity */
  static toDomain(record: TaskRecord): Task {
    return Task.rehydrate({
        id: record.id,
        title: record.title,
        description: record.description,
        projectId: record.projectId,
        created: record.created,
        updated: record.updated,
        status: record.status,
        activities: record.activities.map(activity => ({
          id: activity.id,
          type: activity.type,
          projectId: activity.projectId,
          taskId: activity.taskId,
          userId: activity.userId,
          metadata: activity.metadata,
          occurredAt: activity.occurredAt,
        }))
    })
  }

  static toDomains(items: TaskRecord[]): Task[] {
		let tasks: Task[] = []
		for (const task of items) {
			tasks.push(this.toDomain(task))
		}
		return tasks
	}
}
