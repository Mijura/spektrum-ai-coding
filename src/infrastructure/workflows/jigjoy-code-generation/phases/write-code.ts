import { JigJoyActivitySDK } from "@honeycomb-app/jigjoy-sdk"
import { WorkflowPhase } from "../context"
import { TicketStatus } from "@domain/entities/ticket"

export class WriteCode extends WorkflowPhase {
    name: string = "WriteCode"

    async execute(input: any): Promise<void> {
        console.log("Writing code")

        const { ticket, project, sourceCode, frontendDevelopmentService } = input
        const sdk = new JigJoyActivitySDK(process.env.JIGJOY_ENDPOINT)

        let buildSuccess = false
        let installSuccess = false
        try {

            await frontendDevelopmentService.updateSourceCode(project.id, sourceCode)
            installSuccess = await frontendDevelopmentService.installDependencies(project.id)
            buildSuccess = await frontendDevelopmentService.buildProject(project.id)
            ticket.status = TicketStatus.DONE
        } catch (error) {
            console.error("Error writing files:", error)
            ticket.status = TicketStatus.IN_PROGRESS
            throw error
        } finally {

            await sdk.ingestActivity({
                playerId: project.ownerId, 
                gameId: 'honeycomb', 
                type: 'workflow-execution', 
                data: {
                    projectId: project.id,
                    workflowId: 'code-generation',
                    ticketId: ticket.id,
                    ticketTitle: ticket.title,
                    buildStatus: buildSuccess && installSuccess ? "success" : "failed",
                }
            })
        }

        return {
            ...input,
        }
    }
}