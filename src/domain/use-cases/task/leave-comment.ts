import { Task } from "@domain/entities/task"

export interface LeaveComment {
    execute(taskId: string, authorId: string, commentText: string): Promise<Task>
} 