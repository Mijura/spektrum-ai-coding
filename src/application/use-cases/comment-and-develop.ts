import { Task } from "@domain/entities/task"
import { CommentAndDevelop } from "@domain/use-cases/task-execution/comment-and-develop"
import { develop } from "@infrastructure/dependencies"

export class CommentAndDevelopUseCase implements CommentAndDevelop {

    async execute(taskId: string, authorId: string, commentText: string): Promise<void> {
        try {
            console.log(`Adding comment to task ${taskId} by user ${authorId}.`)
            const task: Task | null = await this.taskRepository.get(taskId)

            if (!task) {
                throw new Error("Task not found.")
            }

            // TODO: Get the user id from the context
            task.leaveComment(authorId, commentText)
            await this.taskRepository.save(task)

            await develop.execute(taskId, authorId)

        } catch (error) {
            console.error("Error during adding comment:", error)
            throw new Error("Failed to add comment and execute the task.")
        }
    }
} 