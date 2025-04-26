import { Project } from "@domain/entities/project";
import { Ticket } from "@domain/entities/ticket";
import { SourceCode } from "@domain/entities/source-code";
import { WorkflowContext } from "./workflow-context";
import { PhaseRegistry } from "./phase-registry";
import EventEmitter from "events";

export interface State {
	project: Project
	ticket: Ticket
	sourceCode: SourceCode
}

export abstract class WorkflowPhase<T = any>  extends EventEmitter  {
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