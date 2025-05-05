import { Issue } from "@domain/entities/issue"
import { Workflow } from "@domain/entities/workflow/workflow"
import { WorkflowPhaseRegistry } from "@domain/entities/workflow/workflow-phase-registry"
import { WorkflowContext } from "@domain/entities/workflow/workflow-context"
import { RefineProjectDetails } from "../project-refining/phases/refine-project-details"

export type ProjectDetails = {
    title: string
    description: string
}

export type Input = {
    issue: Issue
}

export class ProjectRefiningWorkflow extends Workflow {

    async run(issue: Issue): Promise<ProjectDetails> {
        
        WorkflowPhaseRegistry.register(RefineProjectDetails)

        const context = new WorkflowContext(new RefineProjectDetails())

        const projectDetails: ProjectDetails = await context.execute({
            issue
        })

        return projectDetails
    }
}