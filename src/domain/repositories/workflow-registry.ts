import { Workflow } from "@domain/workflow/workflow"
import { WorkflowType } from "@domain/types/workflow"

export interface WorkflowRegistry {
    get(workflowId: string): Promise<Workflow>
    registerWorkflow(type: WorkflowType, workflow: Workflow): void
}