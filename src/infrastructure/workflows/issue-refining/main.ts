import { Issue } from "@domain/entities/issue"
import { Workflow } from "@domain/entities/workflow/workflow"
import { WorkflowPhaseRegistry } from "@domain/entities/workflow/workflow-phase-registry"
import { RefineIssue } from "./phases/refine-issue"
import { WorkflowContext } from "@domain/entities/workflow/workflow-context"

export class IssueRefiningWorkflow extends Workflow {

    async run(issue: Issue): Promise<Issue> {
        
        WorkflowPhaseRegistry.register(RefineIssue)

        const context = new WorkflowContext(new RefineIssue())

        const refinedIssue: Issue = await context.execute({
            issue
        })

        return refinedIssue
    }
}