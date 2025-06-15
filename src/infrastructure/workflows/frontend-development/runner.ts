import { frontendDevelopmentService, projectRepository, taskRepository, workflowRunRepository } from "@infrastructure/dependencies"
import { Task } from "@domain/entities/task"
import { SourceCode } from "@domain/types/source-code"
import { WorkflowRun } from "@domain/entities/workflow-run"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { Project } from "@domain/entities/project"
import { ReactDeveloper } from "./workers/react-developer"
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
            
            const reactDeveloper = new ReactDeveloper(frontendDevelopmentService, projectRepository, taskRepository, workflowRunRepository, task)
            const sourceCode = await reactDeveloper.think(task)
            workflowRun.finishSuccessfully(sourceCode)

        } catch (error: any) {
            workflowRun.finishWithError(error as string, null)
            throw error
        } finally {
            await workflowRunRepository.save(workflowRun)
        }

    }
}