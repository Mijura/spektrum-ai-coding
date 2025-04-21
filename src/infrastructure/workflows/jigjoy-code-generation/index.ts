import { Workflow } from "@domain/entities/workflow";
import { Project } from "@domain/entities/project";
import { Ticket } from "@domain/entities/ticket";
import { frontendDevelopmentService } from "@infrastructure/dependencies";
import { PhaseRegistry } from "./phase-registry";
import { WriteCode } from "./phases/write-code";
import { RefineTicket } from "./phases/refine-ticket";
import { GenerateCode } from "./phases/generate-code";
import { WorkflowContext } from "./workflow-context";

export class JigJoyCodeGeneration extends Workflow {



    constructor() {
        super()
        
    }
    
    async run(project: Project, ticket: Ticket): Promise<Project> {
        const sourceCode = await frontendDevelopmentService.fetchSourceCode(project.id)

        // Register all phases
        PhaseRegistry.register(WriteCode);
        PhaseRegistry.register(GenerateCode);
        PhaseRegistry.register(RefineTicket);

        const context = new WorkflowContext(new RefineTicket());
        
        context.execute({
            project,
            ticket,
            sourceCode: sourceCode
        })

        return project
    }
}