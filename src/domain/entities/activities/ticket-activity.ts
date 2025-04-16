import { v4 as uuidv4 } from "uuid"
import { ActivityInitiator } from "./initiator"



export enum TicketActivityType {
    COMMENT = "Comment",
    WORKFLOW_EXECUTION = "WorkflowExecution"
}
export class TicketActivityMetadata {
    public readonly created: string
    public initiator: ActivityInitiator
    public readonly type: TicketActivityType

	constructor(
		initiator: ActivityInitiator,
		type: TicketActivityType
	) {
		this.created = new Date().toISOString()
		this.initiator = initiator
		this.type = type
	}
}

export class TicketActivity<T> {
    public readonly id: string
    public data: T
    public metadata: TicketActivityMetadata
  
    constructor(initiator: ActivityInitiator, data: T, type: TicketActivityType) {
      	this.id = uuidv4()
      	this.data = data
      	this.metadata = new TicketActivityMetadata(initiator, type)
    }

  }





  