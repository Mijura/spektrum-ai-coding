import { projectRepository, taskRepository, workflowRunRepository } from "@infrastructure/dependencies"
import { UpdateCode } from "./phases/update-code"
import { GenerateCode } from "./phases/generate-code"
import { Task } from "@domain/entities/task"
import { SourceCode } from "@domain/types/source-code"
import { WorkflowRun } from "@domain/entities/workflow-run"
import { WorkflowRunner } from "@domain/ports/workflow-runner"
import { Project } from "@domain/entities/project"
import { Workflow, WorkflowPhaseRegistry } from "@honeycomb-app/hexacore"
export interface State {
	task: Task
	sourceCode: SourceCode
    workflowRun: WorkflowRun
    project: Project
    accountId: string
}
export class FrontendDevelopmentRunner implements WorkflowRunner {
    
    async run(task: Task, accountId: string): Promise<void> {
        const project = await projectRepository.findById(task.projectId)
        const sourceCode = project.artifact
        
		const workflowRun = WorkflowRun.create(task, "Frontend Development", accountId)

		await workflowRunRepository.save(workflowRun)

        try {
            // Register all phases
            WorkflowPhaseRegistry.register(UpdateCode)
            WorkflowPhaseRegistry.register(GenerateCode)

            const context = new Workflow(new GenerateCode())
            
            await context.execute({
                task,
                sourceCode: sourceCode,
                    workflowRun,
                    project,
                    accountId
            })

        } catch (error: any) {
            console.error("Error during frontend development workflow:", error)
            workflowRun.finishWithError(error as string, null)
            await workflowRunRepository.save(workflowRun)
            task.leaveComment("React Developer", `I encountered an error during implementation : ${error.message}. Please try again.`)
            await taskRepository.save(task)
            throw error
        }

    }
}