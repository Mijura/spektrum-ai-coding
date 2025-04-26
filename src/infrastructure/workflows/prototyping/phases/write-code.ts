import { JigJoyActivitySDK } from "@honeycomb-app/jigjoy-sdk"
import { TicketStatus } from "@domain/entities/ticket"
import { frontendDevelopmentService, ticketRepository } from "@infrastructure/dependencies"
import { State, WorkflowPhase } from "../workflow-phase"
import { TicketMapper } from "@infrastructure/mappers/ticket-mapper"
export class WriteCode extends WorkflowPhase {
    name: string = "WriteCode"

    async execute(data: State): Promise<void> {
        console.log("Writing code")

        const { ticket, project, sourceCode } = data
        const sdk = new JigJoyActivitySDK(process.env.JIGJOY_ENDPOINT)

        let buildSuccess = false
        let installSuccess = false
        try {

            await frontendDevelopmentService.updateSourceCode(project.id, sourceCode)
            installSuccess = await frontendDevelopmentService.installDependencies(project.id)
            buildSuccess = await frontendDevelopmentService.buildProject(project.id)
            ticket.leaveComment("DevOps Engineer", "Application build successfully")
        } catch (error) {
            console.error("Error writing files:", error)
            ticket.leaveComment("DevOps Engineer", "Error writing files: " + error)
            throw error
        } finally {

            const update = { 
                node: "DevOps Engineer", 
                ticket: TicketMapper.toRecord(ticket) 
            }

            this.emit('update', update)

            await ticketRepository.save(ticket)
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

    }
}