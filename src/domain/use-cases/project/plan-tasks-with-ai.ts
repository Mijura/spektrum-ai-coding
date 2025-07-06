import { Task } from "@domain/entities/task"

export interface PlanTasksWithAI {
    execute(projectId: string, projectDescription: string): Promise<Task[]>
}