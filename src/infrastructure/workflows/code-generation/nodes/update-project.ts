
import { projectRepository, ticketRepository } from "@infrastructure/dependencies"
import { RootAnnotation } from "../root-annotation"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"
import { TicketMapper } from "@infrastructure/mappers/ticket-mapper"

const updateProject = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { project, ticket } = _state
	
	console.log(`Project to save: ${JSON.stringify(project)}`)
	console.log(`Ticket to save: ${JSON.stringify(ticket)}`)

	const projectPromise = projectRepository.save(ProjectMapper.toDomain(project))
	const ticketPromise = ticketRepository.save(TicketMapper.toDomain(ticket))

	await Promise.all([projectPromise, ticketPromise])

	console.log("\n\nProject details updated successfully")
	return _state
}

export { updateProject }