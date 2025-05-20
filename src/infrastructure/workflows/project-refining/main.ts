import { Task } from "@domain/entities/task"
import { RefineProjectDetails } from "../project-refining/phases/refine-project-details"
import { ProjectDetails } from "@domain/types/project-details"
import { Workflow } from "@domain/workflow/workflow"
import { WorkflowPhaseRegistry } from "@domain/workflow/workflow-phase-registry"
import { WorkflowContext } from "@domain/workflow/workflow-context"

export type Input = {
    task: Task
}
export class ProjectRefiningWorkflow implements Workflow {

    async run(task: Task): Promise<ProjectDetails> {
        
        WorkflowPhaseRegistry.register(RefineProjectDetails)

        const context = new WorkflowContext(new RefineProjectDetails())

        const projectDetails: ProjectDetails = await context.execute({
            task
        })

        return projectDetails
    }
}