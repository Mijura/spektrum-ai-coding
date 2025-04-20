
import { projectRepository, ticketRepository } from "@infrastructure/dependencies"
import { RootAnnotation } from "../root-annotation"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"
import { TicketMapper } from "@infrastructure/mappers/ticket-mapper"

const updateProject = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { project, ticket } = _state

	const projectToSave = ProjectMapper.toDomain(project)
	const ticketToSave = TicketMapper.toDomain(ticket)
	
	const projectPromise = projectRepository.save(projectToSave)
	const ticketPromise = ticketRepository.save(ticketToSave)

	await Promise.all([projectPromise, ticketPromise])

	console.log("\n\nProject details updated successfully")
	return _state
}

export { updateProject }