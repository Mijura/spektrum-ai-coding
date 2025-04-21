import { JigJoyActivitySDK } from "@honeycomb-app/jigjoy-sdk"
import { RootAnnotation } from "../root-annotation"
import { TicketStatus } from "@domain/entities/ticket"
import { frontendDevelopmentService, ticketRepository } from "@infrastructure/dependencies"


const updateCode = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { ticket, project, sourceCode } = _state
	const sdk = new JigJoyActivitySDK(process.env.JIGJOY_ENDPOINT)

	let buildSuccess = false
	let installSuccess = false
	try {

		await frontendDevelopmentService.updateSourceCode(project.id, sourceCode)
		installSuccess = await frontendDevelopmentService.installDependencies(project.id)
		buildSuccess = await frontendDevelopmentService.buildProject(project.id)
		ticket.changeStatus("React Developer", TicketStatus.DONE)
		await ticketRepository.save(ticket)
	} catch (error) {
		console.error("Error writing files:", error)
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
		..._state,
	}
}

export { updateCode }
