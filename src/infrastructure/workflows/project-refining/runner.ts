import { Task } from "@domain/entities/task"
import { ProjectDetails } from "@domain/types/project-details"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { ProjectRefiner } from "./phases/project-refiner"

export type Input = {
    task: Task
}
export class ProjectRefiningRunner implements WorkflowRunner {

    async run(task: Task): Promise<ProjectDetails> {
        
        const worker = new ProjectRefiner(task)

        const projectDetails: ProjectDetails = await worker.execute(task)

        console.log("Project details: ", projectDetails)

        return projectDetails
    }
}