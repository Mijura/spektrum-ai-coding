import { taskExecutionRepository, frontendDevelopmentService, projectRepository, taskRepository } from "@infrastructure/dependencies"
import { Task } from "@domain/entities/task"
import { SourceCode } from "@domain/types/source-code"
import { TaskExecution } from "@domain/entities/task-execution"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { Project } from "@domain/entities/project"
import { ReactDeveloper } from "./workers/react-developer"
import { Contributor, Team } from "@honeycomb-app/hexacore"
import { GraphicDesigner } from "./workers/graphic-designer"
import { ScrumMaster } from "./workers/scrum-master"
export interface State {
	task: Task
	sourceCode: SourceCode
    taskExecution: TaskExecution
    project: Project
    accountId: string
}
export class FrontendDevelopmentRunner implements WorkflowRunner {
    
    async run(task: Task, accountId: string): Promise<any> {


        const taskExecution = TaskExecution.create(task, "Frontend Development", accountId)

        try {

            const reactDeveloper: Contributor = new ReactDeveloper(frontendDevelopmentService, projectRepository, taskRepository, taskExecutionRepository)
            const designer: Contributor = new GraphicDesigner(frontendDevelopmentService, projectRepository, taskRepository, taskExecutionRepository)
            const scrumMaster: Contributor = new ScrumMaster()
            Team.addContributor(reactDeveloper)
            Team.addContributor(designer)
            Team.addContributor(scrumMaster)
            const artifact = await scrumMaster.execute(task)
            taskExecution.finishSuccessfully(artifact)

        } catch (error: any) {
            console.error(error)
            taskExecution.finishWithError(error as string, null)
            throw error
        } finally {
            await taskExecutionRepository.save(taskExecution)
        }

    }
}