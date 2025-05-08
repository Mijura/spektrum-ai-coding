import { Issue } from "@domain/entities/issue"
import { WorkflowPhaseRegistry } from "@domain/entities/workflow/workflow-phase-registry"
import { WorkflowContext } from "@domain/entities/workflow/workflow-context"
import { RefineProjectDetails } from "../project-refining/phases/refine-project-details"
import { ProjectDetails } from "@domain/types/project-details"
import { WorkflowPort } from "@domain/workflows/workflow-port"

export type Input = {
    issue: Issue
}
export class ProjectRefiningWorkflow implements WorkflowPort {

    async run(issue: Issue): Promise<ProjectDetails> {
        
        WorkflowPhaseRegistry.register(RefineProjectDetails)

        const context = new WorkflowContext(new RefineProjectDetails())

        const projectDetails: ProjectDetails = await context.execute({
            issue
        })

        return projectDetails
    }
}