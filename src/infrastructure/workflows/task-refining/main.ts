import { Task } from "@domain/entities/task"
import { RefineTask } from "./phases/refine-task"
import { WorkflowPhaseRegistry } from "@domain/workflow/workflow-phase-registry"
import { WorkflowContext } from "@domain/workflow/workflow-context"
import { Workflow } from "@domain/workflow/workflow"

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