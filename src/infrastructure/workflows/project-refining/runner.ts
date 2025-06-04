import { Task } from "@domain/entities/task"
import { RefineProjectDetails } from "./phases/refine-project-details"
import { ProjectDetails } from "@domain/types/project-details"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { Workflow, WorkflowPhaseRegistry } from "@honeycomb-app/hexacore"

export type Input = {
    task: Task
}
export class ProjectRefiningRunner implements WorkflowRunner {

    async run(task: Task): Promise<ProjectDetails> {
        
        WorkflowPhaseRegistry.register(RefineProjectDetails)

        const context = new Workflow(new RefineProjectDetails())

        const projectDetails: ProjectDetails = await context.execute({
            task
        })

        return projectDetails
    }
}