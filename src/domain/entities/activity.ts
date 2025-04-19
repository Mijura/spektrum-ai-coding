import { ActivityDto } from "@application/dto/ticket";
import { v4 as uuidv4 } from "uuid"

export enum TicketActivityType {
  LEAVE_COMMENT = 'LEAVE_COMMENT',
  TITLE_UPDATED = 'TITLE_UPDATED',
}

export interface CommentCreatedMetadata {
	commentId: string;
}
  
export interface TitleUpdateMetadata {
	message: string;
	oldTitle: string;
	newTitle: string;
}

export interface DescriptionUpdateMetadata {
	message: string;
	oldDescription: string;
	newDescription: string;
}

export interface TicketCreatedMetadata {
	message: string;
	title: string;
	description: string;
}

export type ActivityType = 'TicketCreated' | 'Assigned' | 'CommentEdited' | 'Commented' | 'TitleUpdated' | 'DescriptionUpdated'

export type ActivityMetadata = CommentCreatedMetadata | TitleUpdateMetadata | DescriptionUpdateMetadata | TicketCreatedMetadata

export class Activity {


	constructor(
		public readonly id: string,
		public readonly type: ActivityType,
		public readonly ticketId: string,
		public readonly userId: string,
		public readonly metadata: ActivityMetadata,
		public readonly occurredAt: string
	) {}

	static ticketCreated(userId: string, ticketId: string, title: string, description: string): Activity {

		const metadata: TicketCreatedMetadata = {
			message: "Ticket created",
			title: title,
			description: description
		}

		return new Activity(uuidv4(), 'TicketCreated', ticketId, userId, metadata, new Date().toISOString())
	}
  
	static titleUpdated(userId: string, ticketId: string, oldTitle: string, newTitle: string): Activity {
		const metadata: TitleUpdateMetadata = {
			message: "Title updated",
			oldTitle: oldTitle,
			newTitle: newTitle
		}
		return new Activity(uuidv4(), 'TitleUpdated', ticketId, userId, metadata, new Date().toISOString())
	}

	static descriptionUpdated(userId: any, ticketId: string, oldDescription: string, newDescription: string): Activity {
		const metadata: DescriptionUpdateMetadata = {
			message: "Description updated",
			oldDescription: oldDescription,
			newDescription: newDescription
		}
		return new Activity(uuidv4(), 'DescriptionUpdated', ticketId, userId, metadata, new Date().toISOString())
	}

	static commented(userId: string, ticketId: string, commentId: string): Activity {
		const metadata: CommentCreatedMetadata = {
			commentId: commentId
		}
	  	return new Activity(uuidv4(), 'Commented', ticketId, userId, metadata, new Date().toISOString())
	}
  
	static commentEdited(userId: string, ticketId: string, commentId: string): Activity {
		const metadata: CommentCreatedMetadata = {
			commentId: commentId
		}
	  	return new Activity(uuidv4(), 'CommentEdited', ticketId, userId, metadata, new Date().toISOString())
	}

	static toDto(activity: Activity): ActivityDto {
		return {
			id: activity.id,
			type: activity.type,
			ticketId: activity.ticketId,
			userId: activity.userId,
			metadata: activity.metadata,
			occurredAt: activity.occurredAt,
		}
	}

	static rehydrate(dto: ActivityDto): Activity {
		return new Activity(dto.id, dto.type, dto.ticketId, dto.userId, dto.metadata, dto.occurredAt)
	}
  }
