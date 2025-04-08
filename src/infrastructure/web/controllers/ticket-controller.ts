
import { Request, Response } from "express"
import { TicketMapper } from "@domain/mappers/ticket-mapper"
import { createNewTicket, fetchAllTickets } from "@infrastructure/dependencies/web"

export class TicketController {

	constructor() {}

	async createTicket(req: Request, res: Response): Promise<void> {
		try {
			const { projectId, title, description } = req.body
			const ticket = await createNewTicket.execute(projectId, title, description)
			res.status(201).json(ticket)
		} catch (error) {
			console.error("Error creating ticket:", error)
			res.status(500).json({ message: "Error creating ticket." })
		}
	}

	async fetchAllTickets(req: Request, res: Response): Promise<any> {

		try {
			const { projectId } = req.params
			console.log(`Fetching all tickets for project: ${projectId}`)
			const tickets = await fetchAllTickets.execute(projectId)
			const ticketDtos = TicketMapper.toDtos(tickets)
			res.json(ticketDtos)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching tickets:", error)
			res.status(500).json({ message: "Error fetching tickets" })
		}

    }


}
