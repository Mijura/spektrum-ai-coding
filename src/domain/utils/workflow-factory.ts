// core/domain/workflow/WorkflowRegistry.ts

import { Workflow } from '@domain/entities/workflow';
import { LangGraphCodeGeneration } from '@infrastructure/workflows/code-generation/langgraph/langgraph-generate-code';
import { frontendDevelopmentService } from '@infrastructure/config/dependencies';
export class WorkflowFactory {
  private static readonly workflows: Map<string, Workflow> = new Map([
    ['code-generation', new LangGraphCodeGeneration(frontendDevelopmentService)],
  ]);

  static getById(id: string): Workflow {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow not found: ${id}`);
    }

    return workflow;
  }

  // Optional: Allow dynamic registration (useful for plugins, testing, etc.)
  static register(id: string, workflow: Workflow): void {
    this.workflows.set(id, workflow);
  }
}
