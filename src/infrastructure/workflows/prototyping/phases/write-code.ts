import { frontendDevelopmentService, issueRepository, workflowRunRepository } from "@infrastructure/dependencies"
import { WorkflowPhase } from "../../../../domain/entities/workflow/workflow-phase"
import { State } from "../main"

export class WriteCode extends WorkflowPhase {
    name: string = "WriteCode"

    async execute(data: State): Promise<void> {
        console.log("Writing code")

        const { issue, sourceCode, workflowRun, accountId } = data

        issue.startedWork("DevOps Engineer", "WriteCode", "DevOps engineer is deploying the application for testing...")

        let buildSuccess = false
        let installSuccess = false
        try {

            await frontendDevelopmentService.updateSourceCode(issue.projectId, sourceCode)
            installSuccess = await frontendDevelopmentService.installDependencies(issue.projectId)
            buildSuccess = await frontendDevelopmentService.buildProject(issue.projectId)
            issue.leaveComment("DevOps Engineer", "Application is successfully deployed and now is ready to be tested.")
            workflowRun.finishSuccessfully()
        } catch (error) {
            console.error("Error writing files:", error)
            issue.leaveComment("DevOps Engineer", "I encountered an error during build : " + error)
            workflowRun.finishWithError(error as string)
            throw error
        } finally {
            issue.finishedWork("DevOps Engineer", "WriteCode", "Finished deploying the application for testing")
            await issueRepository.save(issue)
            await workflowRunRepository.save(workflowRun)
        }

    }
}