import { Task } from "@domain/entities/task"
import { WorkflowPhaseRegistry } from "@domain/entities/workflow/workflow-phase-registry"
import { WorkflowContext } from "@domain/entities/workflow/workflow-context"
import { Workflow } from "@domain/entities/workflow/workflow"
import { RefineTask } from "./phases/refine-task"

export class TaskRefiningWorkflow implements Workflow {

    async run(task: Task): Promise<Task> {
        
        WorkflowPhaseRegistry.register(RefineTask)

        const context = new WorkflowContext(new RefineTask())

        const refinedTask: Task = await context.execute({
            task
        })

        return refinedTask
    }
}