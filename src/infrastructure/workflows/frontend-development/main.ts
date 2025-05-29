import { projectRepository, workflowRunRepository } from "@infrastructure/dependencies"
import { UpdateCode } from "./phases/update-code"
import { GenerateCode } from "./phases/generate-code"
import { Task } from "@domain/entities/task"
import { SourceCode } from "@domain/types/source-code"
import { WorkflowRun } from "@domain/entities/workflow-run"
import { Workflow } from "@domain/workflow/workflow"
import { WorkflowPhaseRegistry } from "@domain/workflow/workflow-phase-registry"
import { WorkflowContext } from "@domain/workflow/workflow-context"
import { Project } from "@domain/entities/project"
export interface State {
	task: Task
	sourceCode: SourceCode
    workflowRun: WorkflowRun
    project: Project
    accountId: string
}
export class FrontendDevelopmentWorkflow implements Workflow {
    
    async run(task: Task, accountId: string): Promise<void> {
        const project = await projectRepository.findById(task.projectId)
        const sourceCode = project.artifact
        
		const workflowRun = WorkflowRun.create(task, "Frontend Development", accountId)

		await workflowRunRepository.save(workflowRun)
        // Register all phases
        WorkflowPhaseRegistry.register(UpdateCode)
        WorkflowPhaseRegistry.register(GenerateCode)

        const context = new WorkflowContext(new GenerateCode())
        
        await context.execute({
            task,
            sourceCode: sourceCode,
            workflowRun,
            project,
            accountId
        })

    }
}