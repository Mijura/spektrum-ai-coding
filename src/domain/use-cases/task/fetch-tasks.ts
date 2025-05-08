import { Task } from "@domain/entities/task"

export interface FetchTasks {
    execute(projectId: string): Promise<Task[]> 
}

