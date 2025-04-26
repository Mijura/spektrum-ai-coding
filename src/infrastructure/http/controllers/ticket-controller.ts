import { Request, Response } from "express"
import { TicketDtoMapper } from "@application/mappers/ticket-dto-mapper"
import { createTicket, fetchTickets, updateTicketTitle, updateTicketDescription, leaveComment, prototypingWorkflow, fetchProject } from "@infrastructure/dependencies"
import { TicketDto } from "@application/dto/ticket"

export class TicketController {

	constructor() {}

	async createTicket(req: Request, res: Response): Promise<void> {
		try {
			const { projectId, title, description } = req.body
			const ticket = await createTicket.execute(projectId, title, description)
			res.status(201).json(ticket)
		} catch (error) {
			console.error("Error creating ticket:", error)
			res.status(500).json({ message: "Error creating ticket." })
		}
	}

	async updateTicketTitle(req: Request, res: Response): Promise<void> {
		try {
			const ticketDto: TicketDto = req.body
			const updatedTicket = await updateTicketTitle.execute(ticketDto)
			res.status(200).json(updatedTicket)
		} catch (error) {
			// TODO: Handle Ticket Not Found
			console.error("Error updating ticket title:", error)
			res.status(500).json({ message: "Error updating ticket title." })
		}
    }

	async updateTicketDescription(req: Request, res: Response): Promise<void> {
		try {
			const ticketDto: TicketDto = req.body
			const updatedTicket = await updateTicketDescription.execute(ticketDto)
			res.status(200).json(updatedTicket)
		} catch (error) {
			// TODO: Handle Ticket Not Found
			console.error("Error updating ticket description:", error)
			res.status(500).json({ message: "Error updating ticket description." })
		}
	}

	async fetchTickets(req: Request, res: Response): Promise<any> {

		try {
			const { projectId } = req.params
			console.log(`Fetching all tickets for project: ${projectId}`)
			const tickets = await fetchTickets.execute(projectId)
			const ticketDtos = TicketDtoMapper.toDtos(tickets)
			res.json(ticketDtos)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching tickets:", error)
			res.status(500).json({ message: "Error fetching tickets" })
		}

    }

	async leaveComment(req: Request, res: Response): Promise<void> {
		try {
			const { ticketId, authorId, commentText } = req.body
			const ticket = await leaveComment.execute(ticketId, authorId, commentText)
			const project = await fetchProject.execute(ticket.projectId)
			await prototypingWorkflow.run(project, ticket)
			res.status(200).json(ticket)
		} catch (error) {
			console.error("Error adding comment:", error)
			res.status(500).json({ message: "Error adding comment." })
		}
	}


}
