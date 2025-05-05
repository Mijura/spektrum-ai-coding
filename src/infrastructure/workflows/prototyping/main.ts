import { Workflow } from "@domain/entities/workflow/workflow"
import { Project } from "@domain/entities/project"
import { frontendDevelopmentService } from "@infrastructure/dependencies"
import { WorkflowPhaseRegistry } from "../../../domain/entities/workflow/workflow-phase-registry"
import { WriteCode } from "./phases/write-code"
import { GenerateCode } from "./phases/generate-code"
import { WorkflowContext } from "../../../domain/entities/workflow/workflow-context"
import { Issue } from "@domain/entities/issue"
import { SourceCode } from "@domain/types/source-code"

export interface State {
	issue: Issue
	sourceCode: SourceCode
}
export class PrototypingWorkflow extends Workflow {
    
    async run(issue: Issue): Promise<void> {
        const sourceCode = await frontendDevelopmentService.fetchSourceCode(issue.projectId)
        
        // Register all phases
        WorkflowPhaseRegistry.register(WriteCode)
        WorkflowPhaseRegistry.register(GenerateCode)

        const context = new WorkflowContext(new GenerateCode())
        
        context.execute({
            issue,
            sourceCode: sourceCode
        })

    }
}