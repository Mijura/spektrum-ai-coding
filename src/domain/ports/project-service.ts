import { Task } from "@domain/entities/task"

export interface ProjectService{
    updateDetailsWithAI(task: Task): Promise<void>
}