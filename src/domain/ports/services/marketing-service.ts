import { Task } from "@domain/entities/task"

export interface MarketingService {
    /**
     * Updates the details of a project based on the task
     * @param task The task to update the project details with
     */
    updateProjectDetails(task: Task): Promise<void>
}