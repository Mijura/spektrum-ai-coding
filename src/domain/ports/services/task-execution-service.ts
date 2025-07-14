import { Task } from "@domain/entities/task"

export interface TaskExecutionService {
    runTaskExecution(task: Task): Promise<void>
}