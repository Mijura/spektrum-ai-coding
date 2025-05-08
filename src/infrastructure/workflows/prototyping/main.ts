import { frontendDevelopmentService, workflowRunRepository } from "@infrastructure/dependencies"
import { WorkflowPhaseRegistry } from "../../../domain/entities/workflow/workflow-phase-registry"
import { WriteCode } from "./phases/write-code"
import { GenerateCode } from "./phases/generate-code"
import { WorkflowContext } from "../../../domain/entities/workflow/workflow-context"
import { Issue } from "@domain/entities/issue"
import { SourceCode } from "@domain/types/source-code"
import { WorkflowRun } from "@domain/entities/workflow/workflow-run"
import { WorkflowPort } from "@domain/workflows/workflow-port"
export interface State {
	issue: Issue
	sourceCode: SourceCode
    workflowRun: WorkflowRun
    accountId: string
}
export class PrototypingWorkflow implements WorkflowPort {
    
    async run(issue: Issue, accountId: string): Promise<void> {
        const sourceCode = await frontendDevelopmentService.fetchSourceCode(issue.projectId)
        
		const workflowRun = WorkflowRun.create(issue, "Prototyping", accountId)

		await workflowRunRepository.save(workflowRun)
        // Register all phases
        WorkflowPhaseRegistry.register(WriteCode)
        WorkflowPhaseRegistry.register(GenerateCode)

        const context = new WorkflowContext(new GenerateCode())
        
        await context.execute({
            issue,
            sourceCode: sourceCode,
            workflowRun,
            accountId
        })

    }
}