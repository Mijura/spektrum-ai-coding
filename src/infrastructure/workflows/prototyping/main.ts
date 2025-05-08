import { frontendDevelopmentService, workflowRunRepository } from "@infrastructure/dependencies"
import { WorkflowPhaseRegistry } from "../../../domain/entities/workflow/workflow-phase-registry"
import { WriteCode } from "./phases/write-code"
import { GenerateCode } from "./phases/generate-code"
import { WorkflowContext } from "../../../domain/entities/workflow/workflow-context"
import { Task } from "@domain/entities/task"
import { SourceCode } from "@domain/types/source-code"
import { WorkflowRun } from "@domain/entities/workflow/workflow-run"
import { WorkflowPort } from "@domain/workflows/workflow-port"
export interface State {
	task: Task
	sourceCode: SourceCode
    workflowRun: WorkflowRun
    accountId: string
}
export class PrototypingWorkflow implements WorkflowPort {
    
    async run(task: Task, accountId: string): Promise<void> {
        const sourceCode = await frontendDevelopmentService.fetchSourceCode(task.projectId)
        
		const workflowRun = WorkflowRun.create(task, "Prototyping", accountId)

		await workflowRunRepository.save(workflowRun)
        // Register all phases
        WorkflowPhaseRegistry.register(WriteCode)
        WorkflowPhaseRegistry.register(GenerateCode)

        const context = new WorkflowContext(new GenerateCode())
        
        await context.execute({
            task,
            sourceCode: sourceCode,
            workflowRun,
            accountId
        })

    }
}