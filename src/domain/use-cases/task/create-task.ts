
import { Task } from "@domain/entities/task"

export interface CreateTask {
    execute(projectId: string, title: string, description: string): Promise<Task>
}
