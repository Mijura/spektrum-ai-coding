import { Project } from "@domain/entities/project"
import { Issue } from "@domain/entities/issue"
import { SourceCode } from "@domain/types/source-code"
import { WorkflowContext } from "./workflow-context"
import { PhaseRegistry } from "./phase-registry"

export interface State {
	project: Project
	issue: Issue
	sourceCode: SourceCode
}

export abstract class WorkflowPhase<T = any>  {
    abstract name: string;
    protected context!: WorkflowContext;
    protected data!: T;
  
    setContext(context: WorkflowContext) {
      this.context = context;
    }
  
    setData(data: T) {
      this.data = data;
    }

    transitionTo(name: string, data?: any) {
        const phase = PhaseRegistry.get(name);
        if (!phase) throw new Error(`Phase "${name}" not found in registry.`);
        this.context.transitionTo(phase, data);
    }
  
    abstract execute(input: any): void;
  }