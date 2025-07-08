import { Task } from "@domain/entities/task"

export interface ProjectService{
    updateProjectDetails(task: Task): Promise<void>
}