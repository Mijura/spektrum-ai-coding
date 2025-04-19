import { Activity } from "@domain/entities/activity";
import { Ticket } from "@domain/entities/ticket";
import { TicketRecord } from "@infrastructure/records/ticket";
import { Comment } from "@domain/entities/comment";


export class TicketMapper {

  /** Converts a Ticket domain entity to a raw record */
  static toRecord(ticket: Ticket): TicketRecord {
    return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        projectId: ticket.projectId,
        created: ticket.created,
        updated: ticket.updated,
        status: ticket.status,
        comments: ticket.getComments().map(comment => ({
            id: comment.id,
            authorId: comment.authorId,
            text: comment.text,
            createdAt: comment.createdAt,
            editedAt: comment.editedAt,
        })),
        activities: ticket.getActivityLog().map(activity => ({
            id: activity.id,
            type: activity.type,
            userId: activity.userId,
            metadata: activity.metadata,
            occurredAt: activity.occurredAt,
            ticketId: activity.ticketId,
        })),
    };
  }

  /** Converts a raw ticket record back to a Ticket domain entity */
  static toDomain(record: TicketRecord): Ticket {
    return Ticket.rehydrate({
        id: record.id,
        title: record.title,
        description: record.description,
        projectId: record.projectId,
        created: record.created,
        updated: record.updated,
        status: record.status,
        comments: record.comments.map(comment => Comment.rehydrate({
                id: comment.id,
                authorId: comment.authorId,
                text: comment.text,
                createdAt: comment.createdAt,
                editedAt: comment.editedAt,
        })),
        activities: record.activities.map(activity => Activity.rehydrate({
            id: activity.id,
            type: activity.type,
            userId: activity.userId,
            metadata: activity.metadata,
            occurredAt: activity.occurredAt,
            ticketId: activity.ticketId,
        })),
    });
  }

  static toDomains(items: TicketRecord[]): Ticket[] {
		let tickets: Ticket[] = []
		for (const ticket of items) {
			tickets.push(this.toDomain(ticket))
		}
		return tickets
	}
}
