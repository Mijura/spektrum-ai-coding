import { Task } from "@domain/entities/task"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { ProductOwner } from "./workers/product-owner"
import { taskRepository } from "@infrastructure/dependencies"

export type Input = {
    task: Task
}
export class TaskPlanningRunner implements WorkflowRunner {

    async run(task: Task): Promise<Task[]> {
        
        const worker = new ProductOwner(taskRepository)

        return await worker.execute(task)
    }
}