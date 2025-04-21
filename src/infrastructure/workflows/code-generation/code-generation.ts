
class WorkflowContext {

    private phase: WorkflowPhase;

    private phases = {
        "RefineTicket": new RefineTicket(this),
        "GenerateCode": new GenerateCode(this)
    }

    constructor(phase: WorkflowPhase) {
        this.phase = phase
    }
    
    getPhase(name: string): WorkflowPhase | null {
        switch (name) {
            case "RefineTicket":
                return this.phases[name]
            case "GenerateCode":
                return this.phases[name]
            default:
                return null
        }
    }

    run(data: any): void {
        this.phase.doWork(data)
    }

}



abstract class WorkflowPhase {


    protected context: WorkflowContext;

    constructor(context: WorkflowContext) {
        this.context = context
    }

    transitionTo(data: any, phaseName: string) {
        const phase = this.context.getPhase(phaseName)
        if (phase) {
            phase.doWork(data)
        }
        
    }


    abstract doWork(input: any): void;
}

class RefineTicket extends WorkflowPhase {
    name: string = "RefineTicket"

    doWork(data: any): void {
        console.log("Refining ticket")
        this.transitionTo(data, "GenerateCode")
    }
}

class GenerateCode extends WorkflowPhase {
    name: string = "GenerateCode"

    doWork(data: any): void {
        console.log("Generating code")
    }
}
