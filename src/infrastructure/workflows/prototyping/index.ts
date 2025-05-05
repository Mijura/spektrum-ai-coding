import { Workflow } from "@domain/entities/workflow"
import { Project } from "@domain/entities/project"
import { frontendDevelopmentService } from "@infrastructure/dependencies"
import { PhaseRegistry } from "./phase-registry"
import { WriteCode } from "./phases/write-code"
import { GenerateCode } from "./phases/generate-code"
import { WorkflowContext } from "./workflow-context"
import { Issue } from "@domain/entities/issue"
export class PrototypingWorkflow extends Workflow {
    
    async run(project: Project, issue: Issue): Promise<Project> {
        const sourceCode = await frontendDevelopmentService.fetchSourceCode(project.id)
        
        // Register all phases
        PhaseRegistry.register(WriteCode)
        PhaseRegistry.register(GenerateCode)

        const context = new WorkflowContext(new GenerateCode())
        
        context.execute({
            project,
            issue,
            sourceCode: sourceCode
        })

        return project
    }
}