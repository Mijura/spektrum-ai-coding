
import { projectStorage, ticketStorage } from "@infrastructure/dependencies/web"
import { RootAnnotation } from "../root-annotation"

const updateProject = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { project, ticket } = _state
	
	console.log(`Project to save: ${JSON.stringify(project)}`)
	console.log(`Ticket to save: ${JSON.stringify(ticket)}`)

	const projectPromise = projectStorage.save(project)
	const ticketPromise = ticketStorage.save(ticket)

	const [savedProject, savedTicket] = await Promise.all([projectPromise, ticketPromise])

	console.log("\n\nProject details updated successfully")
	return {
		..._state,
		project: savedProject,
		ticket: savedTicket
	}
}

export { updateProject }