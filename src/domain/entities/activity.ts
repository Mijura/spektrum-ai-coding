export enum TicketActivityType {
  LEAVE_COMMENT = 'LEAVE_COMMENT',
  TITLE_UPDATED = 'TITLE_UPDATED',
}

export interface CommentCreatedMetadata {
	commentId: string;
}
  
interface TitleUpdateMetadata {
	message: string;
	oldTitle: string;
	newTitle: string;
}

interface DescriptionUpdateMetadata {
	message: string;
	oldDescription: string;
	newDescription: string;
}

interface TicketCreatedMetadata {
	message: string;
	title: string;
	description: string;
}

type ActivityType = 'TicketCreated' | 'Assigned' | 'CommentEdited' | 'Commented' | 'TitleUpdated' | 'DescriptionUpdated'

type ActivityMetadata = CommentCreatedMetadata | TitleUpdateMetadata | DescriptionUpdateMetadata | TicketCreatedMetadata
export class TicketActivity {


	constructor(
	  public readonly type: ActivityType,
	  public readonly ticketId: string,
	  public readonly userId: string,
	  public readonly metadata: ActivityMetadata,
	  public readonly occurredAt: Date = new Date()
	) {}

	static ticketCreated(userId: string, id: string, title: string, description: string): TicketActivity {
		return new TicketActivity('TicketCreated', id, userId, { message: "Ticket created", title: title, description: description })
	}
  
	static titleUpdated(userId: string, id: string, oldTitle: string, newTitle: string): TicketActivity {
		return new TicketActivity('TitleUpdated', id, userId, { message: "Title updated", oldTitle: oldTitle, newTitle: newTitle })
	}

	static descriptionUpdated(userId: any, id: string, oldDescription: string, newDescription: string): TicketActivity {
		return new TicketActivity('DescriptionUpdated', id, userId, { message: "Description updated", oldDescription, newDescription })
	}

	static commented(userId: string, ticketId: string, commentId: string): TicketActivity {
	  	return new TicketActivity('Commented', ticketId, userId, { commentId })
	}
  
	static commentEdited(userId: string, ticketId: string, commentId: string): TicketActivity {
	  	return new TicketActivity('CommentEdited', ticketId, userId, { commentId })
	}
  }
