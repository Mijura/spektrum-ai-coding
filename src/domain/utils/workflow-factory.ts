import { Workflow } from '@domain/entities/workflow';
import { codeGenerationWorkflow } from '@infrastructure/dependencies/web';
export class WorkflowFactory {
  private static readonly workflows: Map<string, Workflow> = new Map([
    ['code-generation', codeGenerationWorkflow],
  ]);

  static create(id: string): Workflow {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow not found: ${id}`);
    }

    return workflow;
  }

}
