
import { projectStorage, ticketStorage } from "@infrastructure/dependencies/web"
import { RootAnnotation } from "../state/root-annotation"
import { ProjectMapper } from "@domain/mappers/project-mapper"
import { TicketMapper } from "@domain/mappers/ticket-mapper"

const updateProject = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { project, ticket } = _state
	
	const projectToSave = ProjectMapper.toDomain(project)
	const ticketToSave = TicketMapper.toDomain(ticket)
	
	console.log(`Project to save: ${JSON.stringify(projectToSave)}`)
	console.log(`Ticket to save: ${JSON.stringify(ticketToSave)}`)

	const projectPromise = projectStorage.save(projectToSave)
	const ticketPromise = ticketStorage.save(ticketToSave)

	const [savedProject, savedTicket] = await Promise.all([projectPromise, ticketPromise])

	console.log("\n\nProject details updated successfully")
	return {
		..._state,
		project: savedProject,
		ticket: savedTicket
	}
}

export { updateProject }