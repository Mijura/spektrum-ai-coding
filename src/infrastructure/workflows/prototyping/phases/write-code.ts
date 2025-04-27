import { JigJoyActivitySDK } from "@honeycomb-app/jigjoy-sdk"
import { frontendDevelopmentService, issueRepository } from "@infrastructure/dependencies"
import { State, WorkflowPhase } from "../workflow-phase"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"
export class WriteCode extends WorkflowPhase {
    name: string = "WriteCode"

    async execute(data: State): Promise<void> {
        console.log("Writing code")

        const { issue, project, sourceCode } = data
        const sdk = new JigJoyActivitySDK(process.env.JIGJOY_ENDPOINT)

        let buildSuccess = false
        let installSuccess = false
        try {

            await frontendDevelopmentService.updateSourceCode(project.id, sourceCode)
            installSuccess = await frontendDevelopmentService.installDependencies(project.id)
            buildSuccess = await frontendDevelopmentService.buildProject(project.id)
            issue.leaveComment("DevOps Engineer", "Application build successfully")
        } catch (error) {
            console.error("Error writing files:", error)
            issue.leaveComment("DevOps Engineer", "Error writing files: " + error)
            throw error
        } finally {

            const update = { 
                node: "DevOps Engineer", 
                issue: IssueMapper.toRecord(issue) 
            }

            this.emit('update', update)

            await issueRepository.save(issue)
            await sdk.ingestActivity({
                playerId: project.ownerId, 
                gameId: 'honeycomb', 
                type: 'workflow-execution', 
                data: {
                    projectId: project.id,
                    workflowId: 'prototyping',
                    issueId: issue.id,
                    issueTitle: issue.title,
                    buildStatus: buildSuccess && installSuccess ? "success" : "failed",
                }
            })
        }

    }
}