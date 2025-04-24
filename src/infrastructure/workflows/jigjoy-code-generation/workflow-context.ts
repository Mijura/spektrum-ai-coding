
import { WorkflowPhase } from "./workflow-phase";
import EventEmitter from "events";


export class WorkflowContext extends EventEmitter {
    private currentPhase: WorkflowPhase;
  
    constructor(initialPhase: WorkflowPhase, initialData?: any) {
        super()
        this.currentPhase = initialPhase;
        this.currentPhase.setContext(this);
        if (initialData) {
            this.currentPhase.setData(initialData);
        }
    }
  
    /**
     * Transition to a new phase and pass stateful data
     */

    transitionTo(phase: WorkflowPhase, data?: any) {
        console.log(`[Transition] → ${phase.name}`);
        this.currentPhase = phase;
        this.currentPhase.setContext(this);
        if (data !== undefined) {
          this.currentPhase.setData(data);
        }
        this.currentPhase.execute(data);
      }

  
    /**
     * Entrypoint: delegate input to the current phase
     */
    execute(input: any) {
      this.currentPhase.execute(input);
    }
  
    /**
     * Get current phase (optional utility)
     */
    getCurrentPhase(): WorkflowPhase {
      return this.currentPhase;
    }
  }
  






