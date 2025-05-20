import { WorkflowType } from '@domain/types/workflow'
import { Workflow } from '../../domain/workflow/workflow'
import { WorkflowRegistry } from '@domain/repositories/workflow-registry'

export class InMemoryWorkflowRegistry implements WorkflowRegistry {
    private workflows: Map<WorkflowType, Workflow> = new Map()

    registerWorkflow(type: WorkflowType, workflow: Workflow): void {
        this.workflows.set(type, workflow)
    }

    async get(id: string): Promise<Workflow> {
        // Convert string to enum value
        const workflowType = Object.values(WorkflowType).find(type => type === id)
        if (!workflowType) {
            throw new Error(`Invalid workflow type: ${id}`)
        }

        const workflow = this.workflows.get(workflowType)

        if (!workflow) {
            throw new Error(`Workflow not found: ${id}`)
        }

        return workflow
    }
}
