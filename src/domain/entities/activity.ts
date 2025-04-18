export enum TicketActivityType {
  LEAVE_COMMENT = 'LEAVE_COMMENT',
  TITLE_UPDATED = 'TITLE_UPDATED',
}

export interface CommentCreatedMetadata {
	commentId: string;
}
  
interface TitleUpdateData {
	message: string;
	oldTitle: string;
	newTitle: string;
}

type ActivityType = 'Assigned' | 'CommentEdited' | 'Commented' | 'TitleUpdated'

type ActivityMetadata = CommentCreatedMetadata | TitleUpdateData
export class Activity {

	constructor(
	  public readonly type: ActivityType,
	  public readonly ticketId: string,
	  public readonly userId: string,
	  public readonly metadata: ActivityMetadata,
	  public readonly occurredAt: Date = new Date()
	) {}
  
	static titleUpdated(userId: string, id: string, oldTitle: string, newTitle: string): Activity {
		return new Activity('TitleUpdated', id, userId, { message: "Title updated", oldTitle: oldTitle, newTitle: newTitle })
	}

	static commented(userId: string, ticketId: string, commentId: string): Activity {
	  return new Activity('Commented', ticketId, userId, { commentId })
	}
  
	static commentEdited(userId: string, ticketId: string, commentId: string): Activity {
	  return new Activity('CommentEdited', ticketId, userId, { commentId })
	}
  }
