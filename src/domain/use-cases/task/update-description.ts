
import { TaskDto } from "@application/dto/task"
import { Task } from "@domain/entities/task"

export interface UpdateTaskDescription {
    execute(task: TaskDto): Promise<Task>
}
