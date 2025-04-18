import { Ticket } from "@domain/entities/ticket"
import { ActivityDto, TicketDto } from "@application/dto/ticket"
import { Comment } from "@domain/entities/comment"
import { Activity } from "@domain/entities/activity"

export class TicketMapper {

	/** Convert Ticket entity → marshalled ticket for storage/transfer */
	static toDto(ticket: Ticket): TicketDto {

		const activities: ActivityDto[] = []
		for (const activity of ticket.getActivityLog()) {
			activities.push(Activity.toDto(activity))
		}

		return {
			id: ticket.id,
			projectId: ticket.projectId,
			title: ticket.title,
			description: ticket.description,
			status: ticket.status,
			created: ticket.created,
			updated: ticket.updated,
			comments: Comment.toDtos(ticket.getComments()),
			activities: activities,
		}
	}

	static toDtos(tickets: Ticket[]): TicketDto[] {
		let ticketDtos: TicketDto[] = []
		for (const ticket of tickets) {
			ticketDtos.push(this.toDto(ticket))
		}
		return ticketDtos
	}

	/** Convert marshalled ticket (e.g., from DB) → Ticket entity */
	static toDomain(data: TicketDto): Ticket {

		const comments: Comment[] = []
		for (const dto of data.comments) {
			comments.push(Comment.rehydrate(dto))
		}

		const activities: Activity[] = []
		for (const dto of data.activities) {
			activities.push(Activity.rehydrate(dto))
		}

		return Ticket.rehydrate(
			data.id, 
			data.created, 
			data.projectId, 
			data.title, 
			data.description, 
			data.status, 
			data.updated,
			comments,
			activities
		)
	}

	static toDomains(items: TicketDto[]): Ticket[] {
		let tickets: Ticket[] = []
		for (const ticket of items) {
			tickets.push(this.toDomain(ticket))
		}
		return tickets
	}
}
