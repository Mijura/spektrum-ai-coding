import { workflowRunRepository, frontendDevelopmentService, projectRepository, taskRepository } from "@infrastructure/dependencies"
import { Task } from "@domain/entities/task"
import { SourceCode } from "@domain/types/source-code"
import { WorkflowRun } from "@domain/entities/workflow-run"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { Project } from "@domain/entities/project"
import { Team } from "../team"
import { ReactDeveloper } from "./workers/react-developer"
import { Contributor } from "../contributor"
import { ProductOwner } from "./workers/product-owner"
export interface State {
	task: Task
	sourceCode: SourceCode
    workflowRun: WorkflowRun
    project: Project
    accountId: string
}
export class FrontendDevelopmentRunner implements WorkflowRunner {
    
    async run(task: Task, accountId: string): Promise<any> {


        const workflowRun = WorkflowRun.create(task, "Frontend Development", accountId)

        try {

            const reactDeveloper: Contributor = new ReactDeveloper(frontendDevelopmentService, projectRepository, taskRepository, workflowRunRepository)
            const productOwner: Contributor = new ProductOwner()

            Team.addContributor(productOwner)
            Team.addContributor(reactDeveloper)
            
            const artifact = await productOwner.execute(task)
            workflowRun.finishSuccessfully(artifact)

        } catch (error: any) {
            console.error(error)
            workflowRun.finishWithError(error as string, null)
            throw error
        } finally {
            await workflowRunRepository.save(workflowRun)
        }

    }
}