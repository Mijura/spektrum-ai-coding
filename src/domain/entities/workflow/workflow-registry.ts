import { WorkflowType } from '@domain/types/workflow'
import { WorkflowPort } from '@domain/workflows/workflow-port'
import { prototypingWorkflow } from '@infrastructure/dependencies'

export class WorkflowRegistry {

    private static readonly workflows: Map<string, WorkflowPort> = new Map([
      	[WorkflowType.PROTOTYPING, prototypingWorkflow],
    ])

    static create(id: string): WorkflowPort {
		const workflow = this.workflows.get(id)
		if (!workflow) {
			throw new Error(`Workflow not found: ${id}`)
		}

		return workflow
    }

}
