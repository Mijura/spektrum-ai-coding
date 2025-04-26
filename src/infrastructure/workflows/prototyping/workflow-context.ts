import { WorkflowPhase } from "./workflow-phase";
import EventEmitter from "events";

export class WorkflowContext extends EventEmitter {
    private currentPhase: WorkflowPhase;
    private phaseEventListeners: Map<string, ((data: any) => void)[]> = new Map();
  
    constructor(initialPhase: WorkflowPhase, initialData?: any) {
        super();
        this.currentPhase = initialPhase;
        this.currentPhase.setContext(this);
        if (initialData) {
            this.currentPhase.setData(initialData);
        }
        this.setupPhaseEventListeners();
    }
  
    private setupPhaseEventListeners() {
        // Remove any existing listeners for the current phase
        this.removePhaseEventListeners();
        
        // Set up new listeners
        const updateListener = (data: any) => this.emit("update", data);
        const doneListener = (data: any) => this.emit("done", data);
        
        this.currentPhase.on("update", updateListener);
        this.currentPhase.on("done", doneListener);
        
        // Store listeners for later removal
        this.phaseEventListeners.set("update", [updateListener]);
        this.phaseEventListeners.set("done", [doneListener]);
    }
    
    private removePhaseEventListeners() {
        this.phaseEventListeners.forEach((listeners, event) => {
            listeners.forEach(listener => {
                this.currentPhase.removeListener(event, listener);
            });
        });
        this.phaseEventListeners.clear();
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
        this.setupPhaseEventListeners();
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
  






