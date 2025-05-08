import { Task } from "@domain/entities/task"
import { WorkflowPhaseRegistry } from "@domain/entities/workflow/workflow-phase-registry"
import { RefineTask } from "./phases/refine-task"
import { WorkflowContext } from "@domain/entities/workflow/workflow-context"
import { WorkflowPort } from "@domain/workflows/workflow-port"

export class TaskRefiningWorkflow implements WorkflowPort {

    async run(task: Task): Promise<Task> {
        
        WorkflowPhaseRegistry.register(RefineTask)

        const context = new WorkflowContext(new RefineTask())

        const refinedTask: Task = await context.execute({
            task
        })

        return refinedTask
    }
}