import { WorkflowPhase } from "./workflow-phase";

type PhaseConstructor = new () => WorkflowPhase;

export class PhaseRegistry {
  private static phases: Map<string, PhaseConstructor> = new Map();

  static register(phase: PhaseConstructor) {
    const instance: WorkflowPhase = new phase();
    this.phases.set(instance.name, phase);
  }

  static get(name: string): WorkflowPhase | undefined {
    const ctor = this.phases.get(name);
    return ctor ? new ctor() : undefined;
  }
}