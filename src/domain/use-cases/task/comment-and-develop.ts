import { Task } from "@domain/entities/task"

export interface CommentAndDevelop {
    execute(taskId: string, authorId: string, commentText: string): Promise<Task>
} 