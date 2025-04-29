//import { JigJoyActivitySDK } from "@honeycomb-app/jigjoy-sdk"
import { frontendDevelopmentService, issueRepository } from "@infrastructure/dependencies"
import { State, WorkflowPhase } from "../workflow-phase"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"
import { Comment } from "@domain/entities/comment"
export class WriteCode extends WorkflowPhase {
    name: string = "WriteCode"

    async execute(data: State): Promise<void> {
        console.log("Writing code")

        const { issue, project, sourceCode } = data
        //const sdk = new JigJoyActivitySDK(process.env.JIGJOY_ENDPOINT)

        let buildSuccess = false
        let installSuccess = false
        try {

            await frontendDevelopmentService.updateSourceCode(project.id, sourceCode)
            installSuccess = await frontendDevelopmentService.installDependencies(project.id)
            buildSuccess = await frontendDevelopmentService.buildProject(project.id)
            const comment = Comment.create("DevOps Engineer", "Application is successfully deployed and now is ready to be tested.")
            issue.leaveComment(comment)
        } catch (error) {
            console.error("Error writing files:", error)
            const comment = Comment.create("DevOps Engineer", "I encountered an error during build : " + error)
            issue.leaveComment(comment)
            throw error
        } finally {

            const update = { 
                node: "DevOps Engineer", 
                issue: IssueMapper.toRecord(issue) 
            }

            this.emit('update', update)

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