import { Workflow } from '@domain/entities/workflow/workflow';
import { WorkflowType } from '@domain/types/workflow';
import { prototypingWorkflow } from '@infrastructure/dependencies';
export class WorkflowFactory {
  private static readonly workflows: Map<string, Workflow> = new Map([
    [WorkflowType.PROTOTYPING, prototypingWorkflow],
  ])

  static create(id: string): Workflow {
    const workflow = this.workflows.get(id)
    if (!workflow) {
      throw new Error(`Workflow not found: ${id}`)
    }

    return workflow
  }

}
