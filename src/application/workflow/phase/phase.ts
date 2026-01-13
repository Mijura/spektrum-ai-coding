import { AIDevelopmentWorkflow } from "../ai-development-workflow"

export interface Phase {
	execute(context: AIDevelopmentWorkflow): Promise<void>
}
