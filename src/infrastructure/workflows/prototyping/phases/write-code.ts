//import { JigJoyActivitySDK } from "@honeycomb-app/jigjoy-sdk"
import { frontendDevelopmentService, issueRepository } from "@infrastructure/dependencies"
import { State, WorkflowPhase } from "../workflow-phase"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"

export class WriteCode extends WorkflowPhase {
    name: string = "WriteCode"

    async execute(data: State): Promise<void> {
        console.log("Writing code")

        const { issue, project, sourceCode } = data
        //const sdk = new JigJoyActivitySDK(process.env.JIGJOY_ENDPOINT)

        issue.startedWork("DevOps Engineer", "WriteCode", "DevOps engineer is deploying the application for testing...")

        let buildSuccess = false
        let installSuccess = false
        try {

            await frontendDevelopmentService.updateSourceCode(project.id, sourceCode)
            installSuccess = await frontendDevelopmentService.installDependencies(project.id)
            buildSuccess = await frontendDevelopmentService.buildProject(project.id)
            issue.leaveComment("DevOps Engineer", "Application is successfully deployed and now is ready to be tested.")
        } catch (error) {
            console.error("Error writing files:", error)
            issue.leaveComment("DevOps Engineer", "I encountered an error during build : " + error)
            throw error
        } finally {
            issue.finishedWork("DevOps Engineer", "WriteCode", "Finished deploying the application for testing")
            await issueRepository.save(issue)
            // await sdk.ingestActivity({
            //     playerId: project.ownerId, 
            //     gameId: 'honeycomb', 
            //     type: 'workflow-execution', 
            //     data: {
            //         projectId: project.id,
            //         workflowId: 'prototyping',
            //         issueId: issue.id,
            //         issueTitle: issue.title,
            //         buildStatus: buildSuccess && installSuccess ? "success" : "failed",
            //     }
            // })
        }

    }
}