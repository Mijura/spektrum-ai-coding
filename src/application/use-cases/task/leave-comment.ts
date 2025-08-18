import { LeaveComment } from "@domain/use-cases/task/leave-comment"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { Task } from "@domain/entities/task"
import { eventBus } from "@domain/events/event-bus"
import { taskRunner } from "@infrastructure/dependencies"

export class LeaveCommentUseCase implements LeaveComment {
    constructor(
        private readonly taskRepository: TaskRepository
    ) {}

    async execute(taskId: string, authorId: string, commentText: string): Promise<Task> {
        try {
            console.log(`Adding comment to task ${taskId} by user ${authorId}.`)
            const task: Task | null = await this.taskRepository.get(taskId)

            if (!task) {
                throw new Error("Task not found.")
            }

            eventBus.on("task:update", async (task: Task) => {
                await this.taskRepository.save(task)
            })

            // TODO: Get the user id from the context
            task.leaveComment(authorId, commentText)

            await taskRunner.execute(taskId, authorId)

            return await this.taskRepository.save(task)
        } catch (error) {
            console.error("Error during adding comment:", error)
            throw new Error("Failed to add comment.")
        }
    }
} 