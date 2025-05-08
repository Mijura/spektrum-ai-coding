import { eventBus } from "@domain/services/event-bus"
import { WorkflowRun } from "@domain/entities/workflow/workflow-run"

export class EmitNewWorkflowRun {

    static emit(workflowRun: WorkflowRun): void {
      eventBus.emit("workflow-run:new", workflowRun)
    }

}
