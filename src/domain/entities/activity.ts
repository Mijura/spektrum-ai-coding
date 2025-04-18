import { ActivityDto } from "@application/dto/ticket";

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
	  public readonly type: ActivityType,
	  public readonly ticketId: string,
	  public readonly userId: string,
	  public readonly metadata: ActivityMetadata,
	  public readonly occurredAt: string
	) {}

	static ticketCreated(userId: string, id: string, title: string, description: string): Activity {
		return new Activity('TicketCreated', id, userId, { message: "Ticket created", title: title, description: description }, new Date().toISOString())
	}
  
	static titleUpdated(userId: string, id: string, oldTitle: string, newTitle: string): Activity {
		return new Activity('TitleUpdated', id, userId, { message: "Title updated", oldTitle: oldTitle, newTitle: newTitle }, new Date().toISOString())
	}

	static descriptionUpdated(userId: any, id: string, oldDescription: string, newDescription: string): Activity {
		return new Activity('DescriptionUpdated', id, userId, { message: "Description updated", oldDescription, newDescription }, new Date().toISOString())
	}

	static commented(userId: string, ticketId: string, commentId: string): Activity {
	  	return new Activity('Commented', ticketId, userId, { commentId }, new Date().toISOString())
	}
  
	static commentEdited(userId: string, ticketId: string, commentId: string): Activity {
	  	return new Activity('CommentEdited', ticketId, userId, { commentId }, new Date().toISOString())
	}

	static toDto(activity: Activity): ActivityDto {
		return {
			type: activity.type,
			ticketId: activity.ticketId,
			userId: activity.userId,
			metadata: activity.metadata,
			occurredAt: activity.occurredAt,
		}
	}

	static rehydrate(dto: ActivityDto): Activity {
		return new Activity(dto.type, dto.ticketId, dto.userId, dto.metadata, dto.occurredAt)
	}
  }
