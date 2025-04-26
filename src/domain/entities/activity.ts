import { ActivityDto } from "@application/dto/ticket";
import { v4 as uuidv4 } from "uuid"
import { TicketStatus, WorkflowStatus } from "./ticket";

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

export interface StatusUpdateMetadata {
	message: string;
	status: TicketStatus;
}

export interface WorkflowStatusUpdateMetadata {
	message: string;
	status: WorkflowStatus;
}

export type ActivityType = 'TicketCreated' | 'Assigned' | 'CommentEdited' | 'Commented' | 'TitleUpdated' | 'DescriptionUpdated' | 'StatusChanged'

export type ActivityMetadata = CommentCreatedMetadata | TitleUpdateMetadata | DescriptionUpdateMetadata | TicketCreatedMetadata | StatusUpdateMetadata | WorkflowStatusUpdateMetadata

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
		const message = `${userId} created ticket`
		const metadata: TicketCreatedMetadata = {
			message: message,
			title: title,
			description: description
		}

		return new Activity(uuidv4(), 'TicketCreated', ticketId, userId, metadata, new Date().toISOString())
	}

	static finishedWorkingOnTicket(userId: string, phase: string, ticketId: string, status: WorkflowStatus.SUCCESS | WorkflowStatus.FAILED): Activity {
		const message = `${userId} finished working on ${phase} with status ${status}`
		const metadata: WorkflowStatusUpdateMetadata = {
			message: message,
			status: status
		}
		return new Activity(uuidv4(), 'StatusChanged', ticketId, userId, metadata, new Date().toISOString())
	}
	static startedWorkingOnTicket(userId: string, phase: string, ticketId: string): Activity {
		const message = `${userId} started working on ${phase}`
		const metadata: WorkflowStatusUpdateMetadata = {
			message: message,
			status: WorkflowStatus.IN_PROGRESS
		}
		return new Activity(uuidv4(), 'StatusChanged', ticketId, userId, metadata, new Date().toISOString())	
	}
  
	static titleUpdated(userId: string, ticketId: string, oldTitle: string, newTitle: string): Activity {
		const message = `${userId} changed title to "${newTitle}"`
		const metadata: TitleUpdateMetadata = {
			message: message,
			oldTitle: oldTitle,
			newTitle: newTitle
		}
		return new Activity(uuidv4(), 'TitleUpdated', ticketId, userId, metadata, new Date().toISOString())
	}

	static descriptionUpdated(userId: string, ticketId: string, oldDescription: string, newDescription: string): Activity {

		const message = `${userId} updated description`
		const metadata: DescriptionUpdateMetadata = {
			message: message,
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

	static statusChanged(userId: string, ticketId: string, status: TicketStatus): Activity {
		const message = `${userId} changed status to "${status}"`
		const metadata: StatusUpdateMetadata = {
			message: message,
			status: status
		}
		return new Activity(uuidv4(), 'StatusChanged', ticketId, userId, metadata, new Date().toISOString())
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
