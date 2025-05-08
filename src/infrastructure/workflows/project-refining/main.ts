import { Task } from "@domain/entities/task"
import { WorkflowPhaseRegistry } from "@domain/entities/workflow/workflow-phase-registry"
import { WorkflowContext } from "@domain/entities/workflow/workflow-context"
import { RefineProjectDetails } from "../project-refining/phases/refine-project-details"
import { ProjectDetails } from "@domain/types/project-details"
import { WorkflowPort } from "@domain/workflows/workflow-port"

export type Input = {
    task: Task
}
export class ProjectRefiningWorkflow implements WorkflowPort {

    async run(task: Task): Promise<ProjectDetails> {
        
        WorkflowPhaseRegistry.register(RefineProjectDetails)

        const context = new WorkflowContext(new RefineProjectDetails())

        const projectDetails: ProjectDetails = await context.execute({
            task
        })

        return projectDetails
    }
}