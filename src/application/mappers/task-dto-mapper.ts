import { Task } from "@domain/entities/task"
import { TaskDto } from "@application/dto/task"
export class TaskDtoMapper {


	/** Convert Task entity → marshalled task for storage/transfer */
	static toDto(task: Task): TaskDto {

		return {
			id: task.id,
			projectId: task.projectId,
			title: task.title,
			description: task.description,
			status: task.status,
			created: task.created,
			updated: task.updated,
			activities: task.getActivityLog().map(activity => {
                return {
                    id: activity.id,
                    type: activity.type,
                    projectId: activity.projectId,
                    taskId: activity.taskId,
                    userId: activity.userId,
                    metadata: activity.metadata,
                    occurredAt: activity.occurredAt,
                }
            })
		}
	}

	static toDtos(tasks: Task[]): TaskDto[] {
		let taskDtos: TaskDto[] = []
		for (const task of tasks) {
			taskDtos.push(this.toDto(task))
		}
		return taskDtos
	}

	/** Convert marshalled task (e.g., from DB) → Task entity */
	static toDomain(data: TaskDto): Task {

		return Task.rehydrate({
			id: data.id, 
			created: data.created, 
			projectId: data.projectId, 
			title: data.title, 
			description: data.description, 
			status: data.status, 
			updated: data.updated,
			activities: data.activities
		})
	}

	static toDomains(items: TaskDto[]): Task[] {
		let tasks: Task[] = []
		for (const task of items) {
			tasks.push(this.toDomain(task))
		}
		return tasks
	}
}
