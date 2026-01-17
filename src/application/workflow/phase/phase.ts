import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"

export interface Phase {
	execute(context: AIDevelopmentWorkflow): Promise<void>
}
