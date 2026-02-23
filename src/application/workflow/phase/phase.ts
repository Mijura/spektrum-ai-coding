import { AIDevelopmentWorkflow } from "@app/workflow/ai-development-workflow"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export interface Phase {
	execute(context: AIDevelopmentWorkflow, auth: Auth<UserData>): Promise<void>
}
