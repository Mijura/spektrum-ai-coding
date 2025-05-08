import { TaskDto } from "@application/dto/task"
import { Task } from "@domain/entities/task"


export interface UpdateTaskTitle {
    execute(task: TaskDto): Promise<Task>
}
