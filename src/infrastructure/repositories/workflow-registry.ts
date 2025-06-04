import { WorkflowType } from '@domain/types/workflow'
import { WorkflowRunner } from '../../domain/ports/workflow-runner'
import { WorkflowRegistry } from '@domain/repositories/workflow-registry'

export class InMemoryWorkflowRegistry implements WorkflowRegistry {
    private workflows: Map<WorkflowType, WorkflowRunner> = new Map()

    registerWorkflow(type: WorkflowType, workflow: WorkflowRunner): void {
        this.workflows.set(type, workflow)
    }

    async get(id: string): Promise<WorkflowRunner> {
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
