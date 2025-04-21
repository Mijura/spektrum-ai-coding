import { RefineTicket } from "./phases/refine-ticket";
import { GenerateCode } from "./phases/generate-code";
import { WriteCode } from "./phases/write-code";
import { FrontendDevelopmentService } from "@domain/services/frontend-development";
import { Workflow } from "@domain/entities/workflow";
import { Project } from "@domain/entities/project";
import { Ticket } from "@domain/entities/ticket";

export abstract class WorkflowPhase {


    protected context: FrontendDevelopmentContext;

    constructor(context: FrontendDevelopmentContext) {
        this.context = context
    }

    transitionTo(data: any, phaseName: string) {
        const phase = this.context.getPhase(phaseName)
        if (phase) {
            phase.execute(data)
        }
        
    }


    abstract execute(input: any): void;
}

class FrontendDevelopmentContext {

    private phases = {
        "RefineTicket": new RefineTicket(this),
        "GenerateCode": new GenerateCode(this),
        "WriteCode": new WriteCode(this)
    }

    private phase: WorkflowPhase = this.phases["RefineTicket"];
    
    getPhase(name: string): WorkflowPhase | null {
        switch (name) {
            case "RefineTicket":
                return this.phases[name]
            case "GenerateCode":
                return this.phases[name]
            case "WriteCode":
                return this.phases[name]
            default:
                return null
        }
    }

    run(data: any): void {
        this.phase.execute(data)
    }

}

export class JigJoyCodeGeneration extends Workflow {


    codeGenerator: FrontendDevelopmentContext

    constructor(private readonly frontendDevelopmentService: FrontendDevelopmentService) {
        super()
        this.codeGenerator = new FrontendDevelopmentContext()
    }
    
    async run(project: Project, ticket: Ticket): Promise<Project> {
        await this.codeGenerator.run({
            project,
            ticket
        })

        return project
    }
}






