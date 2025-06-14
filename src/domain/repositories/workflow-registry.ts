import { WorkflowRunner  } from "@domain/ports/workflow-runner"
import { WorkflowType } from "@domain/types/workflow"

export interface WorkflowRegistry {
    get(workflowId: string): Promise<WorkflowRunner>
    registerWorkflow(type: WorkflowType, workflow: WorkflowRunner): void
}